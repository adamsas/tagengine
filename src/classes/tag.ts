import { IPattern } from "./pattern";
import { Query } from "./query";
import { IPosition, Result, Score } from "./result";

/**
 * The tag is an accepted result with the tag: prefix before the text.
 * @extends Result
 */
export class Tag extends Result {
    /**
     * This flag marks the result as an accepted result.
     */
    public readonly accepted = true;
    /**
     * Creates a result.
     * @param {Query} query The query this results belongs to.
     * @param {IPattern} pattern The pattern that matches this result.
     * @param {string} text The matching text that was found.
     * @param {IPosition} position The position of the matched text.
     */
    constructor(query: Query, pattern: IPattern, text: string, position: IPosition) {
        super(query, pattern, text, position, pattern.regex.exec(text));
    }
}
