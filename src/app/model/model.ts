export const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
export const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
export const WEEK_NUMBER = ["1st","2nd","3rd","4th","5th"];

// const arrNumConv = (arr: string[]): ({ [key: string]: number }) => {
//     return Object.fromEntries(arr.map((val, idx) => ([val, idx + 1])));
// }


// const MONTH_NUMS = arrNumConv(MONTHS);
// const DAY_NUMS = arrNumConv(DAYS);
// const WEEK_NUMBER_NUMS = arrNumConv(WEEK_NUMBER);

export interface SettingsModel {
    formatting: PptxSettings;
    events: DateEventModel[];
    banners: { [month: typeof MONTHS[number]]: string }
    year: number;
}



export type DateTypeInfo = 
    { dateType: "Date", month: number, dayNum: number } |
    { dateType: "WeekdayMonth", month: number, week: number, dayOfWeek: number } |
    { dateType: "WeekdayBefore", month: number, date: number, dayOfWeek: number } |
    { dateType: "Custom", identifier: string };


export interface DateEventModel {
    eventName: string;
    imageDataUrl: string | undefined;
    dateInfo: DateTypeInfo;
}



// calculated information pertaining to date event
export interface DateEntry {
    month: number,
    day: number,
    name: string,
    img: string
}

export interface Dimension {
    x: number,
    y: number,
    width: number,
    height: number
}


export interface BorderOptions {
    pt: string;
    color: string;
}

export interface HeaderOptions {
    valign: string;
    align: string;
    fill: string;
    color: string;
}

export interface BodyOptions {
    valign: string;
    align: string;
    font_size: number;
    color: string;
    fill: string;
    italic: boolean;
}

export interface EmptyOptions {
    fill: string;
}

export interface CalOptions {
    valign: string;
    align: string;
    color: string;
    fill: string;
    margin: number;
}

export interface TitleTextOptions {
    color: string;
    valign: string;
}

export interface EventTextOptions {
    color: string;
}

export interface PptxSettings {
    pptxName: string;
    font: string;
    calendarBorder: BorderOptions;
    headerOptions: HeaderOptions;
    bodyOptions: BodyOptions;
    emptyOptions: EmptyOptions;
    miniCalOptions: CalOptions;
    miniCalUnderlineColor: BorderOptions;
    titleTextOptions: TitleTextOptions;
    eventTextOptions: EventTextOptions;
}




// default settings for calendar
export const DefaultFormattingSettings: PptxSettings = {
    pptxName: 'Calendar',
    font: 'Arial', // be careful modifying this as it will impact metrics for determining widths/heights
    calendarBorder: {pt: '1', color: '000000'},
    // saturday, sunday, etc. in main cal
    headerOptions:{
        valign: 'middle',
        align: 'center',
        fill:'000055',
        color:'FFFFFF'
    },
    // options for body calendar cells and date number present
    bodyOptions: {
        valign:'top',
        align:'left', 
        font_size:14, 
        color: '880000', 
        fill: 'FFFFFF', 
        italic: true
    },
    emptyOptions: {
        fill: 'FFFFE0'
    },
    miniCalOptions: {
        valign:'top',
        align:'center', 
        color: '880000', 
        fill: 'FFFFE0', 
        margin:0
    },
    miniCalUnderlineColor: {
        pt: '1',
        color: '880000'
    },
    // i.e. January
    titleTextOptions: {
        color:'000055', 
        valign: 'middle'
    },
    eventTextOptions: {
        color:'880000'
    }
};


export const DefaultSettings: SettingsModel = {
    formatting: DefaultFormattingSettings,
    events: [],
    banners: Object.fromEntries(MONTHS.map(m => ([m, '']))),
    // get next year
    year: new Date().getFullYear() + 1
}

// var rowData = generateDaysTable(month,year,options.bodyOptions,options.emptyOptions,NO_BORDER, settings.calendarBorder);
// var rows = rowData.rows;
// rows.unshift(getHeaderArr(options.headerOpts, settings.calendarBorder));

// slide.addTable(rows, tabOpts);


// generateMiniCalendars(slide, options.miniCalOptions, options.miniCalHeaderOptions, 
//     x, rowData.rowNumber, rowData.topLeftCells, rowData.bottomRightCells, month, year);