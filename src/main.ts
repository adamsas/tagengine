import { IPattern, Pattern } from "./classes/pattern";
import { Query } from "./classes/query";
import { Result, Score } from "./classes/result";

interface ITagEngine {
    (): Query;
    Pattern: ReturnType<() => typeof Pattern>;
    Query: ReturnType<() => typeof Query>;
    Result: ReturnType<() => typeof Result>;
    Score: object;
}

const TagEngine = ((input: string, patterns?: IPattern[]): Query => {
    return new Query(input, patterns);
}) as ITagEngine;

TagEngine.Pattern = Pattern;
TagEngine.Query = Query;
TagEngine.Result = Result;
TagEngine.Score = Score;

(window as any).TagEngine = TagEngine;

export default TagEngine;
