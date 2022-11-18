import * as PptxGen from './PptxGen';

export class SettingsModel {
    Formatting: any;
    Events: DateEventModel[];
    Banners: 
        {January: string, February: string, March: string, April: string, May: string, June: string, 
        July: string, August: string, September: string, October: string, November: string, December: string}; 
    Year: number;

    constructor() {
        this.Formatting = $.extend(true, {}, PptxGen.DefaultSettings);
        
        this.Events = []; //[{EventName: "New Years", ImageDataUrl: "", DateString: "1/21"}];
        this.Banners = 
            {January: '', February: '', March: '', April: '', May: '', June: '', 
            July: '', August: '', September: '', October: '', November: '', December: ''}; 
        this.Year = new Date().getFullYear() + 1;
    }
}


export interface DateEventModel {
    eventName: string;
    imageDataUrl: string;
    dateString: string;
}