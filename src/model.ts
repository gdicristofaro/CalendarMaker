import { DefaultFormattingSettings } from "./pptxgen";

export interface SettingsModel {
    formatting: PptxSettings;
    events: DateEventModel[];
    banners:
    {
        January: string, February: string, March: string, April: string, May: string, June: string,
        July: string, August: string, September: string, October: string, November: string, December: string
    };
    year: number;
}

export const DefaultSettings: SettingsModel = {
    formatting: DefaultFormattingSettings,
    events: [],
    banners: {
        January: '', February: '', March: '', April: '', May: '', June: '',
        July: '', August: '', September: '', October: '', November: '', December: ''
    },
    // get next year
    year: new Date().getFullYear() + 1
}


export interface DateEventModel {
    eventName: string;
    imageDataUrl: string;
    dateString: string;
}


// information pertaining to the date
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

export interface MiniCalOptions {
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
    miniCalOptions: MiniCalOptions;
    miniCalUnderlineColor: BorderOptions;
    titleTextOptions: TitleTextOptions;
    eventTextOptions: EventTextOptions;
}

// var rowData = generateDaysTable(month,year,options.bodyOptions,options.emptyOptions,NO_BORDER, settings.calendarBorder);
// var rows = rowData.rows;
// rows.unshift(getHeaderArr(options.headerOpts, settings.calendarBorder));

// slide.addTable(rows, tabOpts);


// generateMiniCalendars(slide, options.miniCalOptions, options.miniCalHeaderOptions, 
//     x, rowData.rowNumber, rowData.topLeftCells, rowData.bottomRightCells, month, year);