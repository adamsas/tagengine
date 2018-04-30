import { IPattern } from "./pattern";
import { Query } from "./query";

/**
 * Preset scores that can be used when scoring query results.
 */
export enum Score {
    Yup = 1,
    Prolly = 0.75,
    Maybe = 0.5,
    Meh = 0.25,
    Nah = 0,
}

/**
 * Interface for string ranges (from - to indexes) inside a query.
 */
export interface IPosition {
    from: number;
    to: number;
}

/**
 * The result contains the details of the text that was found by a pattern on a specific query.
 */
export class Result {
    /**
     * The query this result belongs to.
     */
    public readonly query: Query;
    /**
     * The pattern that matches this result.
     */
    public readonly pattern: IPattern;
    /**
     * The matching text that was found.
     */
    public readonly text: string;
    /**
     * The array of matches returned by the pattern.
     */
    public readonly matches: RegExpExecArray;
    /**
     * The position of the matched text.
     */
    public readonly position: IPosition;
    /**
     * The score of possibility on this result.
     */
    public score: Score = Score.Nah;
    /**
     * This flag marks the result as an accepted result.
     */
    public readonly accepted: boolean = false;
    /**
     * Creates a result.
     * @param {Query} query The query this results belongs to.
     * @param {IPattern} pattern The pattern that matches this result.
     * @param {string} text The matching text that was found.
     * @param {IPosition} position The position of the matched text.
     * @param {RegExpExecArray} [matches] The regex matches found by the pattern.
     */
    constructor(query: Query, pattern: IPattern, text: string, position: IPosition, matches?: RegExpExecArray) {
        this.query = query;
        this.pattern = pattern;
        this.text = text;
        this.position = position;
        this.matches = matches;
    }
    /**
     * Get all preceding results in the query.
     */
    public before(): Result[] {
        const all = this.query.results;
        const results = [];
        for (let s = 0, l = all.length; s < l; s++) {
            const compare = all[s];
            if (this.position.from <= compare.position.from) {
                break;
            }
            if (this.position.from < compare.position.to) {
                continue;
            }
            results.push(compare);
        }
        return results.reverse();
    }
    /**
     * Get all following results in the query.
     */
    public after(): Result[] {
        const all = this.query.results;
        const results = [];
        for (let s = all.length; 0 < s--;) {
            const compare = all[s];
            if (compare.position.from < this.position.to) {
                break;
            }
            results.unshift(compare);
        }
        return results;
    }
    /**
     * Get all overlapping results in the query;
     */
    public overlap(): Result[] {
        const all = this.query.results;
        const results = [];
        for (let s = 0, l = all.length; s < l; s++) {
            const compare = all[s];
            if (this.position.to < compare.position.from) {
                break;
            }
            if (this === compare || compare.position.to < this.position.from) {
                continue;
            }
            results.push(compare);
        }
        return results;
    }
}
