# TagEngine

TagEngine takes an input string, recognizes patterns and scores the results.

## Quick Start

You can use the TypeScript or the JavaScript version of the TagEngine framework.

* Copy `dist/bundle.js` into your project.
* Import `src/classes/*.ts` into your project.

## Usage

Please see the `example/` directory for usage examples.

```javascript
import { Pattern, IPattern } from "./classes/pattern";
import { Query } from "./classes/query";
import { Result, Score } from "./classes/result";

const query = new Query('FL 123-45-6789 01/1989 something else', [
    new Pattern('State', 'state', /\b(A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])\b/gi, function (result) {
        return result.text.length > 2 || isAfterCity ? Score.Prolly : Score.Maybe;
    }),
    new Pattern('SSN', 'ssn', /\b([0-9]{3})(-)?[0-9]{2}\2[0-9]{4}\b/g, function (result) {
        const firstThree = result.matches ? result.matches[1] : '';
        const isInvalid = firstThree === '000' || firstThree === '666' || firstThree.charAt(0) === '9';
        if (isInvalid) {
            return Score.Nah;
        }
        const hasDashes = result.matches[2] ? true : false;
        if (hasDashes) {
            return Score.Yup;
        }
        return Score.Maybe;
    }),
    new Pattern('Date of Birth', 'dob', /\b(?:(0?[1-9]|1[012])\/(?:(0?[1-9]|[12][0-9]|3[01])\/)?([12][0-9]{3})|([12][0-9]{3})-(0?[1-9]|[12][0-9]|3[01])(?:-(0?[1-9]|1[012]))?|([12][0-9]{3}))\b/g, function (result) {
        const matchedYear = parseInt(result.matches ? result.matches[3] || result.matches[4] || result.matches[7] : '0', 10) || 0,
            isYearReal = 1800 < matchedYear && matchedYear <= new Date().getFullYear() - 10;
        return isYearReal ? Score.Prolly : Score.Nah;
    }),
]);

console.log(query.results);
```
