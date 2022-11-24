const EST_TAG_REGEX = /{est:([0-9]{4})}/g;

// taken from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_function_as_a_parameter
export const getReplacerFunct = (curYear: number) => {
    curYear = Math.floor(curYear);

    return (match: string, estYear: string) => {
        let yearDiff = curYear - parseInt(estYear, 10);
        return numToOrdinalStr(yearDiff); 
    };
}

export const parseNumYears = (eventStr : string, curYear: number) => {
    return eventStr.replace(EST_TAG_REGEX, getReplacerFunct(curYear));
} 

// find established tag {est:[0-9]{4}}

// find ordinal strings: ([0-9]{1,2})(?:st|nd|rd|th)

export const numToOrdinalStr = (num: number) => {
    // number should be an integer; truncate appropriately
    num = Math.floor(num);

    let onesPlace = num % 10;
    let tensPlace = (num / 10) % 10;
    
    if (tensPlace == 1)
        return num.toString() + 'th';

    let ending = '';
    switch (onesPlace) {
        case 1: 
            ending = 'st'; 
            break;
        case 2: 
            ending = 'nd';
            break;
        case 3:
            ending = 'rd';
            break;
        default:
            ending = 'th';
            break;
    }

    return num.toString() + ending;
}

