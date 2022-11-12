import * as $ from 'jquery';
import * as moment from 'moment';
import ParseNumYears from './ParseNumYears';

declare var PptxGenJS : any;

// information pertaining to the date
export class DateEntry {
    public constructor(public month: number, public day: number, public name: string, public img: string) {}
}

class Dimension {
    public constructor(public readonly X: number, public readonly Y: number, public readonly width: number, public readonly height: number) {}
}

export default class PptxGen {
    private static readonly DAYS_OF_WEEK = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

    private static readonly PAGE_WIDTH = 10;
    private static readonly PAGE_HEIGHT = 7.5;

    // defines placement for header image
    private static readonly HEADER_IMG_Y = .1;
    private static readonly HEADER_IMG_HEIGHT = .8;
    private static readonly HEADER_IMG_WIDTH = 6;

    // for the title of the calendar (i.e. February 2018)
    private static readonly CAL_TEXT_X = .5;
    private static readonly CAL_TEXT_Y = 0;
    private static readonly CAL_TEXT_H = 1;
    private static readonly TITLE_TEXT_SIZE = 18;

    // where the calendar starts (1")
    private static readonly CAL_Y = 1;

    // for the calendar height
    private static readonly CAL_HEADER_HEIGHT = .3; //.125;
    private static readonly HEADER_FONT_SIZE = 10;

    // pertaining to cells in the calendar
    private static readonly CAL_CELL_HEIGHT = 1.05;
    private static readonly SIXTH_CELL_HEIGHT = .85;
    private static readonly CAL_CELL_WIDTH = 1.25;

    // the preview for last month and current month
    private static readonly MINI_WIDTH = 1.625;
    private static readonly MINI_HEIGHT = .95;
    private static readonly MINI_SPACING = .125;
    private static readonly MINI_FONT_SIZE = 6;
    
    // pertaining to events displayed in calendar cell
    private static readonly EVENT_CAL_PADDING_PROP = .05;
    private static readonly EVENT_CAL_TOP_PADDING = .25;
    private static readonly EVENT_FONT_SIZE = 7; 
    private static readonly EVENT_IMAGE_SPACING = .025;
    private static readonly CHARACTERS_PER_LINE = 20;

    private static readonly NO_BORDER = {pt: '0', color: '000000'};

    private static readonly CAL_HEIGHTS = [
        PptxGen.CAL_HEADER_HEIGHT,
        PptxGen.CAL_CELL_HEIGHT,
        PptxGen.CAL_CELL_HEIGHT,
        PptxGen.CAL_CELL_HEIGHT,
        PptxGen.CAL_CELL_HEIGHT,
        PptxGen.CAL_CELL_HEIGHT,
        PptxGen.SIXTH_CELL_HEIGHT
    ];

    private static readonly EVENT_HEIGHTS = PptxGen.CAL_HEIGHTS.slice(1);
    
    // default settings for calendar
    public static readonly DefaultSettings = {
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

    // creates options to be used with PptxGenJS from settings
    // some further modifications that ar situationally dependent will still need to occur (i.e. border based on which end cell is on)
    private static generateOptions(settings) {
        let toRet : any = {};

        toRet.headerOpts = $.extend(true, {font_size:PptxGen.HEADER_FONT_SIZE, font_face:settings.font}, settings.headerOptions);
        toRet.bodyOpts = $.extend(true, {font_face:settings.font, border: settings.calendarBorder}, settings.bodyOptions);
        toRet.emptyOpts = settings.emptyOptions;
        toRet.miniCalOpts = $.extend(true, {margin:0, font_size:PptxGen.MINI_FONT_SIZE, font_face:settings.font, border: PptxGen.NO_BORDER}, settings.miniCalOptions);
        toRet.miniCalHeaderOpts = $.extend(true, {}, toRet.miniCalOpts, {border: [PptxGen.NO_BORDER, PptxGen.NO_BORDER, settings.miniCalUnderlineColor, PptxGen.NO_BORDER]});
        toRet.titleTextOpts = $.extend({font_face:settings.font, align: 'left', font_size:PptxGen.TITLE_TEXT_SIZE}, settings.titleTextOptions)
        toRet.eventOpts = $.extend({font_size:PptxGen.EVENT_FONT_SIZE, font_face:settings.font, valign: 'bottom', align: 'c'}, settings.eventTextOptions);
        return toRet;
    }

    private static getHeaderArr(headerOpts, calendarBorder) {

        return PptxGen.DAYS_OF_WEEK.map((day, index, arr) => { 
            let border = [
                calendarBorder,
                index == arr.length - 1 ? calendarBorder : PptxGen.NO_BORDER,
                calendarBorder,
                index == 0 ? calendarBorder : PptxGen.NO_BORDER
            ]
            return { text: day, options: $.extend(false, {border: border}, headerOpts)}; 
        });
    }
    
    private static getMiniHeaderArr(miniCalHeaderOpts) {
        return PptxGen.DAYS_OF_WEEK.map(day => { return { text: day.substring(0,1), options: miniCalHeaderOpts} });
    }


    /**
     * generates array to be utilized with addTable
     * @param month zero-indexed month
     * @param year the year
     * @param opts regular options (for normal date cells)
     * @param emptyopts for cells with no date
     * @param emptyborder the border to use with cells that are "merged"
     * @param defaultborder normal border to use
     * @returns 
     *   rowNumber - the total number of rows in table (not counting header since that isn't added by this function)
     *   topLeftCells - how many cells are before top left date starts
     *   bottomRightCells - same for bottom right
     *   rows - rows to be used with addTable
     */
    private static generateDaysTable(month: number, year: number, opts, emptyopts, emptyborder, defaultborder) {
        var date = moment(new Date(year, month, 1));

        var monthDays = date.daysInMonth();
    
        var arr = [];
    
        // add extra days until we get to start day for month
        var startDay = date.day();
        for (var i = 0; i < startDay; i++) {
            var leftBorder = (i == 0) ? defaultborder : emptyborder;
            var rightBorder = (i == startDay - 1) ? defaultborder : emptyborder;
            var theseEmptyOpts = $.extend(false, {border: [defaultborder, rightBorder, defaultborder, leftBorder]}, emptyopts);
            arr.push({text: '', options: theseEmptyOpts});
        }
    
    
        let topLeftCells = arr.length;
    
        // add items until we get through month
        for (var i = 1; i <= monthDays; i++)
            arr.push({text: i.toString(), options: opts});
    
        var bottomRightCells = 0;
    
        // get to the end of the week
        while (arr.length % 7 != 0) {
            var leftBorder = (i == 0) ? defaultborder : emptyborder;
            var rightBorder = (arr.length % 7 == 6) ? defaultborder : emptyborder;
            var theseEmptyOpts = $.extend(false, {border: [defaultborder, rightBorder, defaultborder, leftBorder]}, emptyopts);
            arr.push({text: '', options: theseEmptyOpts});
            bottomRightCells++;
        }
    
        var retRes = [];
        for (var i = 0; i < arr.length / 7; i++) {
            var portion = arr.slice(i * 7, (i + 1) * 7);
            retRes.push(portion);
        }
    
        return {
            rowNumber: arr.length / 7,
            topLeftCells: topLeftCells,
            bottomRightCells: bottomRightCells,
            rows: retRes
        }
    }


    // gets image from url (path/dataurl)
    private static async getImage(url: string) : Promise<HTMLImageElement> {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            let img = new Image();
            img.onload = () => resolve(img);
            img.src = url;
        });
    }

    // helper function for formatted string
    private static coalesceWords(words: string[], leadingSpace: boolean) {
        var retWords = words.join(" ");
        if (leadingSpace)
            retWords = " " + retWords;

        return { text: retWords, options: {breakLine: false}};
    }

    // pushes the new line if necessary and searches for number + nd|rd|th for superscript
    private static formattedString(str: string, appendLineBreak: boolean) {
        var retArr = [];

        // split on each word
        var splitArr = str.split(" ");

        // holds all the word items until we hit a superscript item (at which point, push to retArr)
        var normalWordBuffer = [];
        var afterSuperScript = false;

        for (var word of splitArr) {
            if (word.match("\\d+(?=st|nd|rd|th)")) {
                // push the first part (normal text) to normal word buffer
                normalWordBuffer.push(word.substring(0, word.length - 2));

                // coalesce all previous normal text and push to return array
                var coalesced = PptxGen.coalesceWords(normalWordBuffer, afterSuperScript);
                retArr.push(coalesced);

                // clear out normal word buffer
                normalWordBuffer = [];

                // push the superscripted items to return array
                retArr.push({text: word.substring(word.length - 2, word.length), options: {superscript: true, breakLine: false}});
                afterSuperScript = true;
            }
            else {
                normalWordBuffer.push(word);
            }
        }

        // flush normal word buffer as before
        if (normalWordBuffer.length > 0) {
            var coalesced = PptxGen.coalesceWords(normalWordBuffer, afterSuperScript);
            retArr.push(coalesced);
        }

        // change options to include linebreak as necessary
        if (appendLineBreak && retArr.length > 0) {
            let lastItem = retArr[retArr.length - 1];
            
            if (!lastItem.options)
                lastItem.options = {};

            lastItem.options.breakLine = true;
        }

        return retArr;
    }

    // get metrics for events to be added to a particular date
    private static getEventMetrics(events: DateEntry[]) {


        let orig : {lines: number, text: any[]} = {lines: 0, text:[]};

        // get number of lines text will be and the object representing text to be added
        return events.reduce((prevMetric, curEv, index) => {
            // TODO this could be changed to better calculate total lines, but this should be fairly accurate
            let lines = prevMetric.lines + Math.ceil(curEv.name.length / PptxGen.CHARACTERS_PER_LINE);
            let items = PptxGen.formattedString(curEv.name, index < events.length - 1);

            for (var textItem of items)
                prevMetric.text.push(textItem);

            return {lines: lines, text: prevMetric.text};
        }, orig);
    }

    /**
     * adds images pertaining to a particular date
     * @param slide the slide to add images to
     * @param imgs the images as dataurl strings
     * @param imgPlacement the dimension for where images can be placed
     * @return the absolute lowest y that text could be added that would not overlap the top of an image
     */
    private static async addEventImages(slide, imgs:string[], imgPlacement:Dimension) {
        // the location where the text will end; set half way in middle of the cell (and if images are added adjust up)
        let textBottom = imgPlacement.Y + imgPlacement.height / 2;

        if (imgs && imgs.length > 0) {
            // image width will be alotted width divided by number of images and alotting for spacing between images
            let imgWidth = (imgPlacement.width - (PptxGen.EVENT_IMAGE_SPACING * (imgs.length - 1))) / imgs.length;

            // center images in available space
            for (let ind = 0; ind < imgs.length; ind++) {
                let val = imgs[ind];

                // determine bounds for image within calendar event bounds
                let imgBounds = new Dimension(imgPlacement.X + imgWidth * ind + (PptxGen.EVENT_IMAGE_SPACING * Math.max(0, ind - 1)),
                    imgPlacement.Y,imgWidth,imgPlacement.height);

                // maximize space while maintaining image proportions
                let img = await PptxGen.getImage(val);
                let resWidth, resHeight;
                if (img.width / img.height > imgBounds.width / imgBounds.height) {
                    resWidth = imgBounds.width;
                    resHeight = img.height * resWidth / img.width;
                }
                else {
                    resHeight = imgBounds.height;
                    resWidth = img.width * resHeight / img.height;
                }

                let imgx = (imgBounds.width - resWidth) / 2 + imgBounds.X;
                let imgy = (imgBounds.height - resHeight) / 2 + imgBounds.Y;
                textBottom = Math.min(textBottom, imgy);

                if (img)
                    slide.addImage({data: img.src, x:imgx, y:imgy, w:resWidth, h:resHeight});
            }
        }

        return textBottom;
    }


    // adds events to a particular cell in the calendar
    private static async addEvents(slide, eventOptions, events: DateEntry[], placement: Dimension) {
        let metrics = PptxGen.getEventMetrics(events);

        // how tall the text will be in pixels
        // constant taken from conversion from points to inches
        let textPixelSize = PptxGen.EVENT_FONT_SIZE * .0138889;

        // determine height dedicated to text
        // images will take at least half of height
        let textHeight = metrics.lines * textPixelSize;
        let availImgHeight = Math.max(placement.height / 2, placement.height - textHeight)
        
        let strArr : string[] = [];

        // get image urls (if present) from event in array
        let imgs = events.reduce((arr, ev) => {
            if (ev.img && ev.img.length > 0)
                arr.push(ev.img)

            return arr;
        }, strArr);

        // max width will be alotted divided by number of images (accounting for spacing)
        let imgYStart = placement.Y + placement.height - availImgHeight;

        let textBottom = await PptxGen.addEventImages(slide, imgs, new Dimension(placement.X, imgYStart, placement.width, availImgHeight));

        // place text right above highest image
        slide.addText(metrics.text, $.extend(true, { x:placement.X, y:placement.Y, w:placement.width, h:textBottom - placement.Y }, eventOptions));
    }

    // gives dimensions that maintain aspect ratio but bounds to maxWidth, maxHeight
    private static sizeToBoundingBox(origWidth: number, origHeight: number, maxWidth: number, maxHeight: number) {
        var origWH = origWidth / origHeight;
        var maxWH = maxWidth / maxHeight;

        // if original width in proportion to height is greater than max width/height, then width will be maximum dimension

        // oW / oH = rW / rH
        var w,h;
        // rH = rW * oH / oW
        if (origWH > maxWH) {
            w = maxWidth;
            h = w * origHeight / origWidth;
        }
        // rW = oW * rH / oH
        else {
            h = maxHeight;
            w = origWidth * h / origHeight;
        }
        return {width: w, height: h};
    }


    /**
     * adds a miniature calendar to the slide
     * @param slide the slide to add to
     * @param miniCalOpts options for the cells of the mini calendar
     * @param miniCalHeaderOpts options for the header cells of the mini calendar (i.e. the underline)
     * @param month the zero-indexed month
     * @param year the year 
     * @param x starting x position
     * @param y starting y position
     */
    private static addMiniCalendar(slide, miniCalOpts, miniCalHeaderOpts, month:number, year:number, x:number, y:number) {
        let prevMonthCal = PptxGen.generateDaysTable(month,year,miniCalOpts,miniCalOpts,PptxGen.NO_BORDER,PptxGen.NO_BORDER).rows;
        prevMonthCal.unshift(PptxGen.getMiniHeaderArr(miniCalHeaderOpts));
    
        const prevDate = moment(new Date(year, month, 1));
        const prevMonthString = prevDate.format("MMM") + " " + prevDate.format("YYYY");
        const spacing = {text:' ', options:miniCalOpts};
        const spacingArr = [spacing, spacing, spacing, spacing, spacing, spacing, spacing];
    
        prevMonthCal.unshift(spacingArr);
    
        const tableOptions = { x:x, y:y, w:PptxGen.MINI_WIDTH, rowH:PptxGen.MINI_HEIGHT/8, fill:'FFFFE0'};
    
        slide.addTable(prevMonthCal, tableOptions);
        slide.addText(prevMonthString, $.extend({ x:x, y:y, w:PptxGen.MINI_WIDTH, h:PptxGen.MINI_HEIGHT/8}, miniCalOpts));
    }

    /**
     * determines where to add miniature calendars for the previous month and next month and adds them accordingly
     * @param slide the slide to add to
     * @param miniCalOpts options for regular mini calendar cells
     * @param miniCalHeaderOpts options for the header mini cells (i.e. underline)
     * @param x x position of the calendar start
     * @param rowNumber numbers of row in this calendar (4-6)
     * @param topLeftCells number of top left cells (where this calendar can be added if enough room)
     * @param bottomRightCells number of bottom right cells (where this calendar can be added if enough room)
     * @param month the zero-indexed month
     * @param year the year 
     */
    private static generateMiniCalendars(slide, miniCalOpts, miniCalHeaderOpts, 
        x: number, rowNumber : number, topLeftCells : number, bottomRightCells : number, month: number, year: number) {

        let prevX;
        let prevY;
        let nextX;
        let nextY;
    
        // width if items are next to each other
        const minisWidth = PptxGen.MINI_SPACING + PptxGen.MINI_WIDTH * 2;
        const minisYOffset = (PptxGen.CAL_CELL_HEIGHT - PptxGen.MINI_HEIGHT) / 2;
        const topRowY = PptxGen.CAL_Y + PptxGen.CAL_HEADER_HEIGHT + minisYOffset;
        const botRowY = topRowY + (rowNumber - 1) * PptxGen.CAL_CELL_HEIGHT;
    
        // determine where mini calendars go
        // if area in top left corner, place calendars there
        if (topLeftCells >= 3) {
            prevY = topRowY;
            nextY = topRowY;
    
            let widthAvail = topLeftCells * PptxGen.CAL_CELL_WIDTH;
            prevX = x + (widthAvail - minisWidth) / 2;
            nextX = prevX + PptxGen.MINI_WIDTH + PptxGen.MINI_SPACING;
        }
        // if area in bottom right corner, place calendars there
        else if (bottomRightCells >= 3) {
            prevY = botRowY;
            nextY = botRowY;
    
            let widthAvail = bottomRightCells * PptxGen.CAL_CELL_WIDTH;
            // x position of calendar and offset for bottom items then offset for centering
            prevX = x + (7 - bottomRightCells) * PptxGen.CAL_CELL_WIDTH + (widthAvail - minisWidth) / 2;
            nextX = prevX + PptxGen.MINI_WIDTH + PptxGen.MINI_SPACING;
        }
        // otherwise, split between top and bottom
        else {
            prevY = topRowY;
            nextY = botRowY;
    
            let topAvail = topLeftCells * PptxGen.CAL_CELL_WIDTH;
            prevX = x + (topAvail - PptxGen.MINI_WIDTH) / 2;
    
            var botAvail = bottomRightCells * PptxGen.CAL_CELL_WIDTH;
            nextX = x + (7 - bottomRightCells) * PptxGen.CAL_CELL_WIDTH + (botAvail - PptxGen.MINI_WIDTH) / 2;
        }
    
        // generate look behind and look ahead
        let prevMonth : number = month - 1;
        let prevYear : number = year;
        let nextMonth : number = month + 1;
        let nextYear : number = year;
    
        if (prevMonth < 0) {
            prevMonth = 11;
            prevYear = year - 1;
        }
    
        if (nextMonth > 11) {
            nextMonth = 0;
            nextYear = year + 1;
        }
    
        PptxGen.addMiniCalendar(slide, miniCalOpts, miniCalHeaderOpts, prevMonth, prevYear, prevX, prevY);
        PptxGen.addMiniCalendar(slide, miniCalOpts, miniCalHeaderOpts, nextMonth, nextYear, nextX, nextY);
    }


    private static async addBanner(slide, imagepath) {
        if (!imagepath || imagepath.length < 1)
            return;

        var img = await PptxGen.getImage(imagepath);
        
        var imgDim = PptxGen.sizeToBoundingBox(img.width, img.height, PptxGen.HEADER_IMG_WIDTH, PptxGen.HEADER_IMG_HEIGHT);
        var imgx = (PptxGen.PAGE_WIDTH - imgDim.width) / 2;
        var imgy = PptxGen.HEADER_IMG_Y + (PptxGen.HEADER_IMG_HEIGHT - imgDim.height) / 2;
    
        if (img)
            slide.addImage({ data:img.src, x:imgx, y:imgy, w:imgDim.width, h:imgDim.height, align: 'center', valign: 'top' });
    }


    private static async generateCalendar(slide, settings, month: number, year: number, imagepath: string, dates: {[day: number] : DateEntry[]}) {
        let options = PptxGen.generateOptions(settings);

        var date = moment(new Date(year, month, 1));
    
        // get month string like January 2018
        var monthStr = date.format("MMMM") + " " + date.format("YYYY");
    
        await PptxGen.addBanner(slide, imagepath);
        
        var width = PptxGen.CAL_CELL_WIDTH * 7;
        var x = (PptxGen.PAGE_WIDTH - width ) / 2;
    
        slide.addText(monthStr, $.extend({ x:PptxGen.CAL_TEXT_X, y:PptxGen.CAL_TEXT_Y, h:PptxGen.CAL_TEXT_H}, options.titleTextOpts));
    
        var tabOpts = { x:x, y:PptxGen.CAL_Y, w:width, rowH: PptxGen.CAL_HEIGHTS };
    
        // generate primary table
        var rowData = PptxGen.generateDaysTable(month,year,options.bodyOpts,options.emptyOpts,PptxGen.NO_BORDER, settings.calendarBorder);
        var rows = rowData.rows;
        rows.unshift(PptxGen.getHeaderArr(options.headerOpts, settings.calendarBorder));
    
        slide.addTable(rows, tabOpts);
    
    
        PptxGen.generateMiniCalendars(slide, options.miniCalOpts, options.miniCalHeaderOpts, 
            x, rowData.rowNumber, rowData.topLeftCells, rowData.bottomRightCells, month, year);

        // info for creating events
        var xEventStart = x;
        var yEventStart = PptxGen.CAL_Y + PptxGen.CAL_HEADER_HEIGHT;
        var eventWidth = PptxGen.CAL_CELL_WIDTH;
    
    
        for (var dt in dates) {
            var dayNum = rowData.topLeftCells + parseInt(dt, 10);
    
            var row = Math.floor((dayNum - 1) / 7);
            var col = (dayNum - 1) % 7;
    
            var thisYPlacement = yEventStart;
            for (var r = 0; r<row; r++)
                thisYPlacement += PptxGen.EVENT_HEIGHTS[r];

            var dim = new Dimension(
                xEventStart + col * eventWidth + eventWidth * PptxGen.EVENT_CAL_PADDING_PROP, 
                thisYPlacement + PptxGen.EVENT_CAL_TOP_PADDING, 
                Math.max(0, eventWidth * (1 - PptxGen.EVENT_CAL_PADDING_PROP * 2)), 
                Math.max(0, PptxGen.EVENT_HEIGHTS[row] - PptxGen.EVENT_CAL_TOP_PADDING - eventWidth * PptxGen.EVENT_CAL_PADDING_PROP));
    
            // add events with image
            await PptxGen.addEvents(slide, options.eventOpts, dates[dt], dim);
        }
    }


    private Settings;
    private Events: DateEntry[];
    private Year: number;
    private Banners: string[];  // dataurls 0-indexed by month

    constructor(settings, events: DateEntry[], banners:string[], year: number) {
        this.Settings = $.extend(true, {}, PptxGen.DefaultSettings, settings);
        this.Events = PptxGen.convertDateEntries(events, year);
        this.Year = year;
        this.Banners = banners;
    }

    private static convertDateEntries(events: DateEntry[], year: number) : DateEntry[] {
        return events.map((dateEntry) => {
            let newString = ParseNumYears.ParseNumYears(dateEntry.name, year);
            return new DateEntry(dateEntry.month, dateEntry.day, newString, dateEntry.img);
        });
    }

    public async create() {
        let pptx = new PptxGenJS();
        pptx.setLayout('LAYOUT_4x3');

        let dates : {[day: number] : DateEntry[]}[] = [];

        for (var i = 0; i < 12; i++)
            dates.push({});

        for (let ev of this.Events) {
            let thisDate = new Date(this.Year, ev.month - 1, ev.day);

            // ensure that this item belongs in this year
            if (thisDate.getFullYear() != this.Year)
                continue;

            let monthItems = dates[thisDate.getMonth()];
            let dayItems;
            if (!monthItems[thisDate.getDate()])
                monthItems[thisDate.getDate()] = new Array<DateEntry>();
            
            monthItems[thisDate.getDate()].push(ev);
        }

        for (var i = 0; i < 12; i++) {
            let slide = pptx.addNewSlide();
            let banner = (this.Banners && this.Banners.length > i) ? this.Banners[i] : null;
            await PptxGen.generateCalendar(slide, this.Settings, i, this.Year, banner, dates[i]);
        }
    
        pptx.save(this.Settings.pptxName + '-' + this.Year.toString()); 
    }

}