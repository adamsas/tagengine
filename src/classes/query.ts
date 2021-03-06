import { IPattern } from "./pattern";
import { IPosition, Result } from "./result";
import { Suggestion } from "./suggestion";
import { Tag } from "./tag";

/**
 * The query processes a text and returns scored results based on the provided patterns.
 */
export class Query {
    /**
     * The array of all results generated by the query.
     */
    public readonly results: Result[];
    /**
     * The queried input text.
     */
    private readonly input: string;
    /**
     * The provided patterns that the query looks for.
     */
    private readonly patterns: IPattern[];
    /**
     * Creates and runs a query.
     * @param {string} input The queried input text.
     * @param {IPattern[]} [patterns] The patterns that the query should look for.
     */
    constructor(input: string, patterns?: IPattern[]) {
        // results
        const results: Result[] = [];
        // properties
        this.input = input;
        this.patterns = patterns || [];
        this.results = results;
        // build patterns by tags
        const patternsByTags: { [tag: string]: IPattern; } = {};
        for (const p in patterns) {
            const pattern = patterns[p];
            patternsByTags[pattern.tag] = pattern;
        }
        // find existing matched tags
        for (const tag in patternsByTags) {
            const pattern = patternsByTags[tag];
            const patternTagRegex = new RegExp(pattern.tag + ":(?:\"([^\"]+)\"|([\\S]+))", "g");
            let match: RegExpExecArray;
            while ((match = patternTagRegex.exec(input)) !== null) {
                const result = new Tag(this, pattern, match[1] || match[2], {
                    from: match.index,
                    to: match.index + match[0].length,
                });
                results.push(result);
            }
        }
        // find patterns
        const inputClean = input.replace(/[\S]+:(?:"[^"]+"|[\S]+)/g, (m) => new Array(m.length + 1).join(" "));
        for (const tag in patternsByTags) {
            const pattern = patternsByTags[tag];
            const patternRegex = pattern.regex;
            let match: RegExpExecArray;
            while ((match = patternRegex.exec(inputClean)) !== null) {
                // improved boundaries
                if (patternRegex.source.indexOf("\\b") === 0 && match.index !== 0 && !inputClean.charAt(match.index - 1).match(/[\s;,"]/)) {
                    patternRegex.lastIndex = match.index + 1;
                    continue;
                }
                if (patternRegex.source.indexOf("\\b", patternRegex.source.length - 2) === patternRegex.source.length - 2 && match.index + match[0].length !== inputClean.length && !inputClean.charAt(match.index + match[0].length).match(/[\s;,"]/)) {
                    patternRegex.lastIndex = match.index + 1;
                    continue;
                }
                // add suggestions
                const result = new Suggestion(this, pattern, match[0], {
                    from: match.index,
                    to: match.index + match[0].length,
                }, match);
                results.push(result);
                // offset only by one
                patternRegex.lastIndex = match.index + 1;
            }
        }
        // sort results by index and length
        results.sort((a, b) => {
            return a.position.from - b.position.from || a.position.to - b.position.to;
        });
        // score results
        results.forEach((result) => {
            result.score = result.pattern.score(result) || 0;
        });
    }
    /**
     * Returns results at the specific index.
     * @param {number} index The zero-based index of the desired character.
     */
    public findAt(index?: number): Result[] {
        if (typeof index === "undefined") {
            return [];
        }
        return this.results.filter((result) => {
            return (result.position.from <= index && index <= result.position.to && result.score > 0);
        }).sort((a, b) => {
            return b.score - a.score;
        });
    }
    /**
     * Returns the original input text with the matched results wrapped in an html tag.
     * @param {string} [wrapper=mark] The tag name of the html element to wrap the results.
     */
    public markup(wrapper: string = "mark"): string {
        let output = this.input;
        // find overlaps
        const ranges: IPosition[] = [];
        let last: IPosition;
        this.results.forEach((result) => {
            if (result.accepted) {
                // don't mark accepted ones
            } else if (result.score <= 0) {
                // don't mark invalid ones
            } else if (!last || result.position.from > last.to) {
                ranges.push(last = {
                    from: result.position.from,
                    to: result.position.to,
                });
            } else if (result.position.to > last.to) {
                last.to = result.position.to;
            }
        });
        // wrap suggestions
        let offset = 0;
        ranges.forEach((range) => {
            const from = range.from + offset;
            output = output.slice(0, from) + "<" + wrapper + ">" + output.slice(from);
            offset += wrapper.length + 2;
            const to = range.to + offset;
            output = output.slice(0, to) + "</" + wrapper + ">" + output.slice(to);
            offset += wrapper.length + 3;
        });
        return output;
    }
    /**
     * Returns all the string pieces that were not matched by any patterns.
     */
    public unknown(): string[] {
        const input = this.input;
        const parts: string[] = [];
        if (input.length > 0) {
            let i = 0;
            this.results.forEach((result) => {
                if (i < result.position.from) {
                    const str = input.substring(i, result.position.from);
                    if (str.trim() !== "") {
                        parts.push(str);
                    }
                }
                if ((result.accepted || result.score > 0) && i < result.position.to) {
                    i = result.position.to;
                }
            });
            (() => {
                const str = input.substring(i, input.length);
                if (str.trim() !== "") {
                    parts.push(str);
                }
            })();
        }
        return parts;
    }
}
