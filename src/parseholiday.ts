import { addDays, addWeeks, getDay, setDay } from 'date-fns';
import {DateTypeInfo } from './model';


export const parseHoliday = (dateInfo: DateTypeInfo, year: number): { month: number, date: number } => {
    switch (dateInfo.dateType) {
        case 'Date': return {month: dateInfo.month, date: dateInfo.dayNum };
        case 'WeekdayMonth': return { month: dateInfo.month, date: getNthDayOfMonth(year, dateInfo.month, dateInfo.dayOfWeek, dateInfo.week)};
        case 'WeekdayBefore': return { month: dateInfo.month, date: getWeekDayBefore(year, dateInfo.month, dateInfo.dayOfWeek, dateInfo.date)};
        case 'Custom': return getCustomDate(year, dateInfo.identifier);
    }
}

const getWeekDayBefore = (year: number, month: number, dayOfWeek: number, date: number): number => {
    let maxLimitDate = new Date(year, month, date);
    let maxLimitDayOfWeek = getDay(maxLimitDate);
    let dayDiff = maxLimitDayOfWeek - dayOfWeek;
    while (dayDiff < 0) {
        dayDiff += 7;
    }

    let dateBefore = addDays(maxLimitDate, -dayDiff);
    return dateBefore.getDate();
}


const getCustomDate = (year: number, identifier: string): { month: number; date: number; } => {
    switch (identifier.toLowerCase()) {
        case "easter":
            return calculateEaster(year);
        default:
            console.warn(`Could not create custom date for: ${identifier}.  Returning 1/1`);
            return { month: 1, date: 1 };
    }
}



const getNthDayOfMonth = (year: number, month: number, weekDay: number, nth: number): number => {
    let startOfMonth = new Date(year, month, 1);
    let firstWeekDayOfMonth = setDay(startOfMonth, weekDay, {weekStartsOn: getDay(startOfMonth) });
    let nthWeekDayOfMonth = addWeeks(firstWeekDayOfMonth, nth - 1);
    return nthWeekDayOfMonth.getDate();
}

// const matchDate = (dateString: string) : DateTypeInfo => { 
//     // match day of week before date
//     let beforeDateRegex = /([0-9]{1,2})\/\(([0-9]),\[-([0-9]{1,2})\]\)/g;
//     let beforeDateMatch = beforeDateRegex.exec(dateString);
//     if (beforeDateMatch) {
//         return {
//             dateType: DateType.WeekdayBefore,
//             month: parseInt(beforeDateMatch[1],10),
//             weekday: parseInt(beforeDateMatch[2],10),
//             day: parseInt(beforeDateMatch[3],10),
//             week: undefined
//         };
//     }

//     // match day of week of month
//     let dayOfWeekRegex = /([0-9]{1,2})\/\(([0-9]),([0-9])\)/g;
//     let dayOfWeekMatch = dayOfWeekRegex.exec(dateString);
//     if (dayOfWeekMatch) {
//         console.log("dayOfWeekMatch", dayOfWeekMatch)
//         return {
//             dateType: DateType.WeekdayMonth,
//             month: parseInt(dayOfWeekMatch[1],10),
//             weekday: parseInt(dayOfWeekMatch[2],10),
//             day: undefined,
//             week: parseInt(dayOfWeekMatch[3],10)
//         };
//     }

//     // match date 
//     let dateRegex = /([0-9]{1,2})\/([0-9]{1,2})/g;
//     let dateMatch = dateRegex.exec(dateString);
//     if (dateMatch) {
//         return {
//             dateType: DateType.Date,
//             month: parseInt(dateMatch[1],10),
//             day: parseInt(dateMatch[2],10),
//             weekday: undefined,
//             week: undefined
//         };
//     }

//     return {
//         dateType: DateType.Custom,
//         month: undefined,
//         day: undefined,
//         weekday: undefined,
//         week: undefined
//     };
// }


// taken from https://stackoverflow.com/questions/1284314/easter-date-in-javascript
const calculateEaster = (year: number) => {
    let C = Math.floor(year/100);
    let N = year - 19*Math.floor(year/19);
    let K = Math.floor((C - 17)/25);
    let I = C - Math.floor(C/4) - Math.floor((C - K)/3) + 19*N + 15;
    I = I - 30*Math.floor((I/30));
    I = I - Math.floor(I/28)*(1 - Math.floor(I/28)*Math.floor(29/(I + 1))*Math.floor((21 - N)/11));
    let J = year + Math.floor(year/4) + I + 2 - C + Math.floor(C/4);
    J = J - 7*Math.floor(J/7);
    let L = I - J;
    let M = 3 + Math.floor((L + 40)/44);
    let D = L + 28 - 31*Math.floor(M/4);

    return { month: M, date: D };
}