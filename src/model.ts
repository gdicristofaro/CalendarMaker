export interface SettingsModel {
    Formatting: PptxSettings;
    Events: DateEventModel[];
    Banners:
        {
            January: string, February: string, March: string, April: string, May: string, June: string,
            July: string, August: string, September: string, October: string, November: string, December: string
        };
    Year: number;

    // constructor() {
    //     this.Formatting = $.extend(true, {}, PptxGen.DefaultSettings);

    //     this.Events = []; //[{EventName: "New Years", ImageDataUrl: "", DateString: "1/21"}];
    //     this.Banners =
    //     {
    //         January: '', February: '', March: '', April: '', May: '', June: '',
    //         July: '', August: '', September: '', October: '', November: '', December: ''
    //     };
    //     this.Year = new Date().getFullYear() + 1;
    // }
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