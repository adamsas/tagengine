// TagEngine init
const Pattern = TagEngine.Pattern;
const Query = TagEngine.Query;
const Score = TagEngine.Score;

// Helper Methods
const joinValues = (array) => {
    return array.sort((a, b) => {
        return b.length - a.length;
    }).map((item) => {
        return item.replace(/[{}()*+?.$|\\\^\-\[\]\/]/g, "\\$&");
    }).join("|");
};
const swapKeysValues = (object) => {
    const ret = {};
    for (let o in object) {
        ret[object[o]] = o;
    };
    return ret;
};

// Init
(async () => {

    // Sample Dictionaries
    const firstNames = await (await fetch("../dictionaries/firstNames.json")).json();
    const firstNamesMale = await (await fetch("../dictionaries/firstNamesMale.json")).json();
    const firstNamesFemale = await (await fetch("../dictionaries/firstNamesFemale.json")).json();
    const lastNames = await (await fetch("../dictionaries/lastNames.json")).json();
    const allNames = await (await fetch("../dictionaries/allNames.json")).json();
    const companySuffixes = await (await fetch("../dictionaries/companySuffixes.json")).json();
    const companyEntities = await (await fetch("../dictionaries/companyEntities.json")).json();
    const areaCodes = await (await fetch("../dictionaries/areaCodes.json")).json();
    const streetPrefixes = await (await fetch("../dictionaries/streetPrefixes.json")).json();
    const streetSuffixes = await (await fetch("../dictionaries/streetSuffixes.json")).json();
    const unitDesignations = await (await fetch("../dictionaries/unitDesignations.json")).json();
    const cities = await (await fetch("../dictionaries/cities.json")).json();
    const citiesAll = [].concat(...Object.values(cities));
    const states = await (await fetch("../dictionaries/states.json")).json();
    const statesReverse = swapKeysValues(states);
    const streetSuffixesExceptCities = streetSuffixes.filter((suffix) => !citiesAll.some((city) => city.startsWith(suffix + " ")));
    const makesAndModels = await (await fetch("../dictionaries/makesAndModels.json")).json();
    const makes = Object.keys(makesAndModels);
    const models = [].concat(...Object.values(makesAndModels));

    // Sample Regexes
    const alphabeticOnlyMatch = /^[a-z ]+$/i;
    const numericOnlyMatch = /^[0-9 ]+$/i;
    const zipCodeMatch = /(?!00[02-5]|099|213|269|34[358]|353|419|42[89]|51[789]|529|53[36]|552|5[67]8|5[78]9|621|6[348]2|6[46]3|659|69[4-9]|7[034]2|709|715|771|81[789]|8[3469]9|8[4568]8|8[6-9]6|8[68]7|9[02]9|987)[0-9]{5}/;
    const licenseMatches = {"al":/^[0-9]{1,7}$/,"ak":/^[0-9]{1,7}$/,"az":/^[0-9a-z][0-9]{8}$/i,"ar":/^[0-9]{4,9}$/,"ca":/^[a-z][0-9]{7}$/i,"co":/^(?:[0-9]{9}|[a-z][0-9a-z][0-9]{2,5})$/i,"ct":/^[0-9]{9}$/,"de":/^[0-9]{1,7}$/,"dc":/^[0-9]{7}(?:[0-9]{2})?$/,"fl":/^[a-z][0-9]{3}(-)?[0-9]{3}\1[0-9]{2}\1[0-9]{3}\1[0-9]$/i,"ga":/^[0-9]{7,9}$/,"hi":/^[0-9a-z][0-9]{8}$/i,"id":/^(?:[a-z]{2}[0-9]{6}|[a-z][0-9]{9})$/i,"il":/^[a-z][0-9]{11,12}$/i,"in":/^[0-9a-z]?[0-9]{9}$/i,"ia":/^(?:[0-9]{9}|[0-9]{3}[a-z]{2}[0-9]{4})$/i,"ks":/^(?:[a-z][0-9][a-z][0-9][a-z]|[0-9a-z][0-9]{8})$/i,"ky":/^(?:[a-z][0-9]{8,9}|[0-9]{9})$/i,"la":/^[0-9]{1,9}$/,"me":/^[0-9]{7}[0-9a-z]?$/i,"md":/^[a-z][0-9]{12}$/i,"ma":/^[0-9a-z][0-9]{8}$/i,"mi":/^[a-z][0-9]{10}(?:[0-9]{2})?$/i,"mn":/^[a-z][0-9]{12}$/i,"ms":/^[0-9]{9}$/i,"mo":/^(?:[a-z][0-9]{6}r|[a-z][0-9]{5,9}|[0-9]{8}[0-9a-z][a-z]|[0-9]{9})$/i,"mt":/^(?:[a-z][0-9]{8}|[0-9]{13,14}|[0-9]{9})$/i,"ne":/^[a-z][0-9]{6,8}$/i,"nv":/^(?:[0-9]{9,10}|[0-9]{12}|x[0-9]{8})$/i,"nh":/^[0-9]{2}[a-z]{3}[0-9]{5}$/i,"nj":/^[a-z][0-9]{14}$/i,"nm":/^[0-9]{8,9}$/i,"ny":/^(?:[a-z][0-9]{18}|[a-z][0-9]{7}|[a-z]{8}|[0-9]{16}|[0-9]{8,9})$/i,"nc":/^[0-9]{1,12}$/,"nd":/^(?:[a-z]{3}[0-9]{6}|[0-9]{9})$/i,"oh":/^(?:[a-z][0-9a-z][0-9]{3,7}|[0-9]{8})$/i,"ok":/^[a-z]?[0-9]{9}$/i,"or":/^[0-9]{1,9}$/,"pa":/^[0-9]{8}$/,"ri":/^[0-9a-z][0-9]{6}$/i,"sc":/^[0-9]{5,11}$/,"sd":/^(?:[0-9]{12}|[0-9]{6,10})$/,"tn":/^[0-9]{7,9}$/,"tx":/^[0-9]{7,8}$/,"ut":/^[0-9]{4,10}$/,"vt":/^[0-9]{7}[0-9a]$/i,"va":/^(?:[0-9]{9}|[a-z][0-9]{9,11})$/i,"wa":/^(?=.{12}$)[a-z]{1,7}[0-9a-z*]{4,11}$/i,"wi":/^[a-z]{1}[0-9]{13}$/i,"wy":/^[0-9]{9,10}$/i};
    const licenseMatchesAll = Object.values(licenseMatches);
    const tagMatches = {"al":/^(?=.{7}$)(?:[0-9]{1,2}[a-z]{2}[0-9]{3,4}|[a-z]{2}[0-9]{5}|[0-9]{5}[a-z]{2})$/i,"ak":/^[a-z]{3}[0-9]{3}$/i,"az":/^[a-z]{3}[0-9]{4}$/i,"ar":/^(?:[0-9]{3}[a-z]{3}|[a-z]{3}[0-9]{3})$/i,"ca":/^(?:[0-9][a-z]{3}[0-9]{3}|[0-9]{5}[a-z][0-9]|[0-9]{3}[a-z]{3}|[a-z]{3}[0-9]{3})$/i,"co":/^(?:[0-9]{3}[a-z]{3}|[a-z]{2}[0-9a-z][0-9]{3}|[a-z][0-9]{4})$/i,"ct":/^(?:[a-z]{2}[0-9]{5}|[0-9][a-z]{4}[0-9]|[0-9]{3}[a-z]{3})$/i,"de":/^[0-9]{6}$/,"dc":/^(?:[a-z]{2}[0-9]{4}|[0-9]{6})$/i,"fl":/^(?:[a-z]{4}[0-9]{2}|[0-9]{3}[0-9a-z][a-z]{2}|[a-z][0-9]{3}[a-z]{2})$/i,"ga":/^(?:[a-z]{3}[0-9]{4}|(?=.{6}$)[0-9]{3,5}[a-z]{1,3})$/i,"hi":/^[a-hj-npr-z][a-z]{2}[0-9]{3}$/i,"id":/^(?:[a-z][0-9]{6}|[0-9][a-z][0-9a-z]{2}[0-9]{3}|[0-9][a-z][0-9]{4}[a-z]|[0-9]{2}|[a-z][0-9]{4})$/i,"il":/^(?:[a-z]{2}[0-9]{5}|[0-9a-z][0-9]{6})$/i,"in":/^(?:[0-9]{3}[a-z]{1,3}|[a-z]{3}[0-9]{3})$/i,"ia":/^(?:[a-z]{3}[0-9]{3}|[0-9]{3}[a-z]{3})$/i,"ks":/^(?:[a-z]{3}[0-9]{3}|[0-9]{3}[a-z]{3})$/i,"ky":/^[0-9]{3}[a-z]{3}$/i,"la":/^(?:[a-z]{3}[0-9]{3}|[0-9]{3}[a-z]{3})$/i,"me":/^(?:[0-9]{4}[a-z]{2}|[a-z][0-9]{2}[0-9]{4})$/i,"md":/^(?:[0-9][a-z]{2}[0-9]{4}|[0-9][a-z]{3}[0-9]{2}|[a-z]{3}[0-9]{3})$/i,"ma":/^(?:(?=.{6}$)[0-9]{1,3}[a-z]{1,3}[0-9]{,3}|[0-9]{6})$/i,"mi":/^(?:[a-z]{3}[0-9]{3,4}|[0-9][a-z]{3}[0-9]{2}|[0-9]{3}[a-z]{3})$/i,"mn":/^[0-9]{3}[a-z]{3}$/i,"ms":/^[a-z]{3}[0-9]{3}$/i,"mo":/^[a-z]{2}[0-9][a-z][0-9][a-z]$/i,"mt":/^(?:[0-9]{6}[a-z]|[a-z]{3}[0-9]{3}||[0-9][a-z][0-9]{4}[0-9a-z])$/i,"ne":/^(?:[a-z]{3}[0-9]{3}|(?=.{6}$)[0-9]{1,2}[a-z]{1,2}[0-9]{2,4})$/i,"nv":/^(?:[0-9]{2}[a-z][0-9]{3}|(?=.{6}$)[a-z]{1,3}[0-9]{3,5}|[0-9]{3}[a-z]{3})$/i,"nh":/^[0-9]{6,7}$/i,"nj":/^(?:[a-z][0-9]{2}[0-9]{3}|[a-z]{3}[0-9]{2}[0-9a-z]|[a-z]{3}[0-9]{4}|[0-9]{3}[a-z]{3}|[a-z]{2}[0-9]{3}[a-z])$/i,"nm":/^(?:[0-9]{3}[a-z]{3}|[a-z]{2,3}[0-9]{3}|(?=.{6}$)[0-9]{,4}nm[0-9]{,4})$/i,"ny":/^[a-z]{3}[0-9]{4}$/i,"nc":/^[a-z]{3}[0-9]{4}$/i,"nd":/^[0-9]{3}[a-z]{3}$/i,"oh":/^(?:[a-z]{3}[0-9]{4}|[a-z]{2}[0-9]{2}[a-z]{2}|[0-9]{3}[a-z]{3})$/i,"ok":/^(?:[a-z]{3}[0-9]{3}|[0-9]{3}[a-z]{3})$/i,"or":/^(?:[0-9]{3}[a-z]{3}|[a-z]{3}[0-9]{3}|[0-9][a-z]{2}[0-9]{4})$/i,"pa":/^[a-z]{3}[0-9]{4}$/i,"pr":/^[a-z]{3}[0-9]{3}$/i,"ri":/^(?:[0-9]{5,6}|[a-z]{2}[0-9]{3})$/i,"sc":/^(?:[a-z]{3}[0-9]{3}|[0-9]{4}[a-z]{2})$/i,"sd":/^(?=.{6}$)[0-9]{1,2}[a-z]{1,3}[0-9]{1,3}$/i,"tn":/^(?:[a-z][0-9]{4}[a-z]|[0-9]{3}[a-z]{3})$/i,"tx":/^(?:[a-z]{3}[0-9]{4}|[a-z]{2}[0-9][a-z][0-9]{3})$/i,"ut":/^(?:[a-z][0-9]{3}[a-z]{2}|[0-9]{4}[a-z]|[a-z]{3}[0-9]{3}|[0-9]{3}[a-z]{3}|[0-9]{3}[a-z][0-9])$/i,"vt":/^(?:[a-z]{3}[0-9]{3}|(?=.{6}$)[0-9]{1,2}[a-z]{1,2}[0-9]{1,3})$/i,"va":/^[a-z]{3}[0-9]{3,4}$/i,"wa":/^(?:[a-z]{3}[0-9]{4}|[0-9]{3}[a-z]{3})$/i,"wv":/^[0-9a-z][a-z]{2}[0-9]{3}$/i,"wi":/^(?:[a-z]{3}[0-9]{4}|[0-9]{3}[a-z]{3})$/i,"wy":/^(?:[0-9]{7}|[0-9]{4}[0-9a-z])$/i};

    // Define Patterns
    const patterns = [
        new Pattern("Name", "name", /\b(?:[a-z]+[-])?[a-z]{3,}\b/gi, (suggestion) => {
            const name = (suggestion.text || "").toLowerCase();
            const isPopularName = firstNames.indexOf(name) >= 0 || firstNamesMale.indexOf(name) >= 0 || firstNamesFemale.indexOf(name) >= 0 || lastNames.indexOf(name) >= 0;
            const isNameReal = allNames.indexOf(name) >= 0;
            return isPopularName ? Score.Prolly : isNameReal ? Score.Maybe : Score.Meh;
        }),
        new Pattern("Company Name", "company", new RegExp("\\b[a-z-]{3,}(?:(?: (?:" + joinValues(companySuffixes) + "))|(?:,? (?:" + joinValues(companyEntities) + ")\.?))\\b", "gi"), (suggestion) => {
            return Score.Prolly;
        }),
        new Pattern("Phone Number", "phone", /\b(?:(?:\(([0-9]{3})\) ?)|(?:([0-9]{3})-?))[0-9]{3}-?[0-9]{4}\b/g, (suggestion) => {
            const areaCode = parseInt(suggestion.matches ? suggestion.matches[1] || suggestion.matches[2] : 0, 10);
            const isValidAreaCode = areaCode && areaCodes.indexOf(areaCode) >= 0;
            const hasFormatting = suggestion.text.includes("(") || suggestion.text.includes("-");
            if (isValidAreaCode && hasFormatting) {
                return Score.Yup;
            }
            if (isValidAreaCode) {
                return Score.Prolly;
            }
            return Score.Meh;
        }),
        new Pattern("Date of Birth", "dob", /\b(?:(0?[1-9]|1[012])\/(?:(0?[1-9]|[12][0-9]|3[01])\/)?([12][0-9]{3})|([12][0-9]{3})-(0?[1-9]|[12][0-9]|3[01])(?:-(0?[1-9]|1[012]))?|([12][0-9]{3}))\b/g, (suggestion) => {
            const matchedYear = parseInt(suggestion.matches ? suggestion.matches[3] || suggestion.matches[4] || suggestion.matches[7] : 0, 10) || 0;
            const isYearReal = 1800 < matchedYear && matchedYear <= new Date().getFullYear() - 10;
            return isYearReal ? Score.Prolly : Score.Nah;
        }),
        new Pattern("SSN", "ssn", /\b([0-9]{3})(-)?[0-9]{2}\2[0-9]{4}\b/g, (suggestion) => {
            const firstThree = suggestion.matches ? suggestion.matches[1] : "";
            const isInvalid = firstThree === "000" || firstThree === "666" || firstThree.charAt(0) === "9";
            if (isInvalid) {
                return Score.Nah;
            }
            const hasDashes = suggestion.matches[2] ? true : false;
            if (hasDashes) {
                return Score.Yup;
            }
            return Score.Maybe;
        }),
        new Pattern("TIN", "tin", /\b([0-9]{2})(-)?[0-9]{7}\b/g, (suggestion) => {
            const hasDashes = suggestion.matches && suggestion.matches[2] ? true : false;
            if (hasDashes) {
                return Score.Yup;
            }
            return Score.Maybe;
        }),
        new Pattern("Driver's License", "license", /\b([a-z][0-9]{4} [0-9]{5} [0-9]{5}|[a-z][0-9]{4}-[0-9]{2}-[0-9]{4}|[a-z][0-9]{3}-[0-9]{4}-[0-9]{4}-[0-9]{2}|[a-z][0-9]{3}-[0-9]{4}-[0-9]{4}|[a-z][0-9]{3}-[0-9]{3}-[0-9]{2}-[0-9]{3}-[0-9]|[a-z]?[0-9]{2}-[0-9]{3}-[0-9]{3}|[a-z][0-9]{2}-[0-9]{2}-[0-9]{4}|[a-z][- ][0-9]{3}[- ][0-9]{3}[- ][0-9]{3}[- ][0-9]{3}|[a-z]{3}-[0-9]{2}-[0-9]{4}|(?=.{12})[a-z]{1,7}[0-9a-z*]{4,11}|[0-9]{6}-[0-9]{3}|[0-9]{3}-[0-9]{3}-[0-9]{3}|[0-9]{3}-[0-9]{2}-[0-9]{4}|[0-9]{2}-[0-9]{3}-[0-9]{4}|[0-9]{2}-[0-9]{2}-[0-9]{5}|[a-z]{8}|[a-z]{3}[0-9]{6}|[a-z]{2}[0-9]{5,6}|[a-z][0-9]{6}[a-z]|[a-z][0-9][a-z][0-9][a-z]|[a-z][0-9]{18}|[a-z][0-9a-z][0-9]{2,7}|[a-z][0-9]{5,14}|[0-9]{16}|[0-9]{8}[0-9a-z][a-z]|[0-9]{7}[a-z]|[0-9]{3}[a-z]{2}[0-9]{4}|[0-9]{2}[a-z]{3}[0-9]{5}|[0-9]{1,14})\b/gi, (suggestion) => {
            const license = suggestion.text.replace(/[^0-9a-z]/gi, "");
            const isStateLicense = suggestion.query.results.some((s) => {
                if (s.pattern.tag === "state") {
                    const licenseState = s.text.toLowerCase();
                    const licenseMatch = licenseMatches[licenseState] || licenseMatches[statesReverse[licenseState]];
                    if (licenseMatch) {
                        return licenseMatch.test(license);
                    }
                }
                return false;
            });
            if (isStateLicense) {
                return Score.Prolly;
            }
            const isRealLicense = licenseMatchesAll.some((licenseMatch) => {
                return licenseMatch.test(license);
            });
            if (isRealLicense) {
                return license.length > 8 ? Score.Maybe : Score.Meh;
            }
            return Score.Nah;
        }),
        new Pattern("Street", "street", new RegExp("\\b(?:(?:([0-9-]+) )?(?:(" + joinValues(streetPrefixes) + ") )|(?:([0-9-]+) )(?:(" + joinValues(streetPrefixes) + ") )?)((?:[a-z](?:[a-z-]|[0-9-]| )*?|[0-9]+?(?:st|nd|rd|th)) (?:" + joinValues(streetSuffixes) + ")(?: (?:" + joinValues(streetSuffixesExceptCities) + "))?)\\.?(?: (?:(?:" + joinValues(unitDesignations) + ") ?([0-9a-z]+)))?\\b", "gi"), (suggestion) => {
            const isOverlapStreet = suggestion.overlap().some((s, i, arr) => {
                return s.pattern.tag === "street" && s.length > suggestion.length;
            });
            if (isOverlapStreet) {
                return Score.Meh;
            }
            const streetNumber = suggestion.matches ? suggestion.matches[1] || suggestion.matches[3] : "";
            const streetPrefix = suggestion.matches ? suggestion.matches[2] || suggestion.matches[4] : "";
            const streetName = suggestion.matches ? suggestion.matches[5] : "";
            return streetNumber && streetPrefix && streetName ? Score.Yup : (streetNumber || streetPrefix) && streetName ? Score.Prolly : Score.Maybe;
        }),
        new Pattern("City", "city", new RegExp("\\b([a-z]{2,} )?[a-z]{3,}\\b", "gi"), (suggestion) => {
            const isOverlapStreet = suggestion.overlap().some((s, i, arr) => {
                return s.pattern.tag === "street";
            });
            if (isOverlapStreet) {
                return Score.Meh;
            }
            const isPopularCity = citiesAll.indexOf(suggestion.text.toLowerCase()) >= 0;
            const isAfterStreet = suggestion.before().some((s, i, arr) => {
                return s.pattern.tag === "street" && suggestion.position.from <= s.position.to + 4;
            });
            let isBeforeState = false;
            const isPopularStateCity = suggestion.after().some((s, i, arr) => {
                const state = s.pattern.tag === "state" && s.position.from <= suggestion.position.to + 4 && s.text.toLowerCase();
                const stateKey = (statesReverse[state] || state || '').toLowerCase();
                isBeforeState = isBeforeState || state ? true : false;
                return cities[stateKey] && cities[stateKey].indexOf(suggestion.text.toLowerCase()) >= 0;
            });
            const isOverlapState = suggestion.overlap().some((s, i, arr) => {
                return s.pattern.tag === "state";
            });
            return isPopularCity && isAfterStreet || isPopularStateCity ? Score.Yup : (isPopularCity || isAfterStreet && isBeforeState) && !isOverlapState ? Score.Prolly : isPopularCity || isBeforeState ? Score.Maybe : Score.Meh;
        }),
        new Pattern("State", "state", /\b(Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming|A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])\b/gi, (suggestion) => {
            const isOverlapStreet = suggestion.overlap().some((s, i, arr) => {
                return s.pattern.tag === "street";
            });
            if (isOverlapStreet) {
                return Score.Meh;
            }
            const isAfterCity = suggestion.before().some((s, i, arr) => {
                return s.pattern.tag === "city" && suggestion.position.from <= s.position.to + 4;
            });
            const isBeforeZip = suggestion.after().some((s, i, arr) => {
                return s.pattern.tag === "zip" && s.position.from <= suggestion.position.to + 4;
            });
            return isBeforeZip ? Score.Yup : suggestion.text.length > 2 || isAfterCity ? Score.Prolly : Score.Maybe;
        }),
        new Pattern("Zip", "zip", /\b([0-9]{5})(-[0-9]{4})?\b/g, (suggestion) => {
            const zipCode = suggestion.matches ? suggestion.matches[1] : "";
            const isValidZipCode = zipCodeMatch.test(zipCode);
            if (!isValidZipCode) {
                return Score.Nah;
            }
            const isAfterState = suggestion.before().some((s, i, arr) => {
                return s.pattern.tag === "state" && suggestion.position.from <= s.position.to + 4;
            });
            return isAfterState ? Score.Yup : Score.Maybe;
        }),
        new Pattern("VIN", "vin", /\b[0-9a-hj-npr-z]{3}[0-9a-hj-npr-z]{5}[0-9X][0-9a-hj-npr-z][0-9a-hj-npr-z][0-9a-hj-npr-z]{6}\b/gi, (suggestion) => {
            return Score.Yup;
        }),
        new Pattern("Vehicle Year", "year", /\b[12][0-9]{3}\b/gi, (suggestion) => {
            const matchedYear = parseInt(suggestion.text, 10) || 0;
            const isYearReal = 1900 < matchedYear && matchedYear <= new Date().getFullYear() + 2;
            if (!isYearReal) {
                return Score.Nah;
            }
            const isBeforeMake = suggestion.after().some((s, i, arr) => {
                return s.pattern.tag === "make" && s.position.from <= suggestion.position.to + 4;
            });
            if (isBeforeMake) {
                return Score.Yup;
            }
            const isBeforeModelOrVin = suggestion.after().some((s, i, arr) => {
                return (s.pattern.tag === "model" || s.pattern.tag === "vin") && s.position.from <= suggestion.position.to + 4;
            });
            if (isBeforeModelOrVin) {
                return Score.Prolly;
            }
            return Score.Nah;
        }),
        new Pattern("Vehicle Make", "make", new RegExp("\\b(" + joinValues(makes) + ")\\b", "gi"), (suggestion) => {
            const make = suggestion.text.toLowerCase();
            const isBeforeModel = suggestion.after().some((s, i, arr) => {
                const compareModel = s.text.toLowerCase();
                return s.pattern.tag === "model" && s.position.from <= suggestion.position.to + 4 && makesAndModels[make].indexOf(compareModel) >= 0;
            });
            return isBeforeModel ? Score.Yup : Score.Prolly;
        }),
        new Pattern("Vehicle Model", "model", new RegExp("\\b(" + joinValues(models) + ")\\b", "gi"), (suggestion) => {
            const model = suggestion.text.toLowerCase();
            const isAfterMake = suggestion.before().some((s, i, arr) => {
                const compareMake = s.text.toLowerCase();
                return s.pattern.tag === "make" && suggestion.position.from <= s.position.to + 4 && makesAndModels[compareMake].indexOf(model) >= 0;
            });
            if (isAfterMake) {
                return Score.Yup;
            }
            const isAlphabeticOnly = alphabeticOnlyMatch.test(suggestion.text);
            if (isAlphabeticOnly) {
                return Score.Meh;
            }
            const isNumericOnly = numericOnlyMatch.test(suggestion.text);
            if (isNumericOnly) {
                return Score.Nah;
            }
            return Score.Maybe;
        }),
        new Pattern("Vehicle Tag", "tag", /\b[a-z0-9]{4,7}\b/gi, (suggestion) => {
            const tag = suggestion.text.replace(/[^0-9a-z]/gi, "");
            const isStateTag = suggestion.query.results.some((s) => {
                if (s.pattern.tag === "state") {
                    const tagState = s.text.toLowerCase();
                    const tagMatch = tagMatches[tagState] || tagMatches[statesReverse[tagState]];
                    if (tagMatch) {
                        return tagMatch.test(tag);
                    }
                }
                return false;
            });
            if (isStateTag) {
                return Score.Prolly;
            }
            const isAlphabeticOnly = alphabeticOnlyMatch.test(suggestion.text);
            if (isAlphabeticOnly) {
                return Score.Meh;
            }
            const isNumericOnly = numericOnlyMatch.test(suggestion.text);
            if (isNumericOnly) {
                return Score.Meh;
            }
            const isAfterVehicle = suggestion.before().some((s, i, arr) => {
                return (s.pattern.tag === "make" || s.pattern.tag === "model" || s.pattern.tag === "vin") && (i < 4 || suggestion.position.from <= s.position.to + 4);
            });
            const isBeforeVehicle = suggestion.after().some((s, i, arr) => {
                return (s.pattern.tag === "make" || s.pattern.tag === "model" || s.pattern.tag === "vin") && (i < 4 || s.position.from <= suggestion.position.to + 4);
            });
            if (isBeforeVehicle || isAfterVehicle) {
                return Score.Prolly;
            }
            return Score.Maybe;
        }),
        new Pattern("Email", "email", /\b(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))\b/g, (suggestion) => {
            return Score.Yup;
        })
    ];

    // Setup Elements and Run Query
    const input = document.getElementById("input");
    const output = document.getElementById("output");
    const summary = document.getElementById("summary");
    const wrap = document.getElementById("wrap");
    const timer = document.getElementById("timer");
    const onChange = () => {
        const start = performance.now();
        const query = new Query(input.value, patterns);
        const end = performance.now();
        // post-score processing
        (() => {
            let countLast = 0;
            query.results.forEach((s) => {
                // last name improvements
                if (s.pattern.tag === "name" && s.score <= 0.5) {
                    const isKnown = s.overlap().some((c, i, arr) => {
                        return c.score > 0.5;
                    });
                    if (isKnown) {
                        return;
                    }
                    const isAfterName = s.before().some((c, i, arr) => {
                        return c.pattern.tag === "name" && s.position.from <= c.position.to + 1 && c.score >= 0.5 && (c.score = 0.75);
                    });
                    if (isAfterName) {
                        if (countLast < 1) {
                            s.score = 0.75;
                            countLast++;
                        } else {
                            countLast = 0;
                        }
                    }
                }
                // ssn first
                if (s.pattern.tag === "ssn" && s.score === 0.50) {
                    const isKnown = s.overlap().some((c, i, arr) => {
                        return c.score > 0.5;
                    });
                    if (isKnown) {
                        return;
                    }
                    s.score = 0.75;
                }
            });
        })();
        // output
        output.innerHTML = query.results.map((s) => {
            return s.pattern.tag
                + `\t${s.accepted ? "&#10003;" : " "}`
                + `\t[${s.score.toFixed(2)}]`
                + `\t"${s.text}"`;
        }).join("\n");
        timer.innerText = (end - start).toFixed(4) + "ms" + "+ " + (performance.now() - end).toFixed(4) + "ms";
        // limit & keep top results
        query.results = query.results.slice(0).sort((a, b) => {
            return b.score - a.score || a.position.from - b.position.from || a.position.to - b.position.to;
        }).filter((s) => {
            return s.score > 0.5 || s.accepted;
        }).reduce((a, s, k, arr) => {
            a = k === 0 ? arr : a;
            s.overlap().forEach((o) => {
                const i = a.indexOf(o);
                if (i >= 0) {
                    a.splice(i, 1);
                }
            });
            return a;
        }, []).sort((a, b) => {
            return a.position.from - b.position.from || a.position.to - b.position.to;
        });
        // summary
        const all = query.results.map((s) => {
            return s.pattern.tag
                + `\t${s.accepted ? "&#10003;" : " "}`
                + `\t[${s.score.toFixed(2)}]`
                + `\t"${s.text}"`;
        });
        const unknown = query.unknown().join(" ").replace(/[^a-z0-9\s]/ig, "").replace(/\s+/g, " ").trim();
        if (unknown !== "") {
            all.push(`unknown?\t[-na-]\t"${unknown}"`);
        }
        wrap.innerHTML = query.markup() || "&nbsp;";
        summary.innerHTML = all.join("\n");
        // console and window vars
        Object.assign(window, {
            query,
            onChange,
        });
    };
    onChange();

})();