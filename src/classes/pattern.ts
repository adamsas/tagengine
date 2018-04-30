import { Result, Score } from "./result";

/**
 * Interface for pattern objects.
 */
export interface IPattern {
    readonly name: string;
    readonly tag: string;
    readonly regex: RegExp;
    readonly score: (result: Result) => Score;
}

/**
 * The pattern defines a tag and is also used to return matches on a query.
 */
export class Pattern implements IPattern {
    /**
     * The user friendly name for the pattern.
     */
    public readonly name: string;
    /**
     * The tag is used tagging in the query.
     */
    public readonly tag: string;
    /**
     * The regular expression that finds matches for this pattern on the query.
     */
    public readonly regex: RegExp;
    /**
     * The callable scoring method. It takes a matched result and scores it.
     */
    public readonly score: (result: Result) => Score;
    /**
     * Creates a pattern that can be ran against a query.
     * @param {string} name The user friendly name for the pattern.
     * @param {string} tag The tag is used tagging in the query.
     * @param {RegExp} regex The regular expression that finds matches for this pattern on the query;
     * @param {function} [score] The callable scoring method. It takes a matched result and scores it.
     */
    constructor(name: string, tag: string, regex: RegExp, score: (result: Result) => Score = () => Score.Maybe) {
        this.name = name;
        this.tag = tag;
        this.regex = regex;
        this.score = score;
    }
}
