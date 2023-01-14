import { format, getDay, getDaysInMonth } from 'date-fns';
import { BorderOptions, DateEntry, Dimension, HeaderOptions, CalOptions, PptxSettings, EventTextOptions } from './model';
import { parseNumYears } from './parsenumyears';
import pptxgen from "pptxgenjs";

const DAYS_OF_WEEK = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const PAGE_WIDTH = 10;
const PAGE_HEIGHT = 7.5;


// defines placement for header image
const HEADER_IMG_Y = .1;
const HEADER_IMG_HEIGHT = .8;
const HEADER_IMG_WIDTH = 6;

// for the title of the calendar (i.e. February 2018)
const CAL_TEXT_X = .5;
const CAL_TEXT_Y = 0;
const CAL_TEXT_H = 1;
const TITLE_TEXT_SIZE = 18;
const DATE_NUMBER_FONT_SIZE = 14;

// where the calendar starts (1")
const CAL_Y = 1;

// for the calendar height
const CAL_HEADER_HEIGHT = .3; //.125;
const HEADER_FONT_SIZE = 10;

// pertaining to cells in the calendar
const CAL_CELL_HEIGHT = 1.05;
const SIXTH_CELL_HEIGHT = .85;
const CAL_CELL_WIDTH = 1.25;

// the preview for last month and current month
const MINI_WIDTH = 1.625;
const MINI_HEIGHT = .95;
const MINI_SPACING = .125;
const MINI_FONT_SIZE = 6;

// pertaining to events displayed in calendar cell
const EVENT_CAL_PADDING_PROP = .05;
const EVENT_CAL_TOP_PADDING = .25;
const EVENT_FONT_SIZE = 7; 
const EVENT_IMAGE_SPACING = .025;
const CHARACTERS_PER_LINE = 20;

const NO_BORDER = null;

const CAL_HEIGHTS = [
    CAL_HEADER_HEIGHT,
    CAL_CELL_HEIGHT,
    CAL_CELL_HEIGHT,
    CAL_CELL_HEIGHT,
    CAL_CELL_HEIGHT,
    CAL_CELL_HEIGHT,
    SIXTH_CELL_HEIGHT
];

const INCHES_TO_POINT = .0138889;

const EVENT_HEIGHTS = CAL_HEIGHTS.slice(1);


/**
 * Generates options and layout for each cell in headers.
 * @param headerOpts Options for header.
 * @param calendarBorder Options for the border.
 * @returns PptxGen layout array.
 */
const getHeaderArr = (headerOpts: HeaderOptions, calendarBorder: BorderOptions) => {

    return DAYS_OF_WEEK.map((day, index, arr) => { 
        let border = [
            calendarBorder,
            index === arr.length - 1 ? calendarBorder : NO_BORDER,
            calendarBorder,
            index === 0 ? calendarBorder : NO_BORDER
        ]
        return { text: day, options: {...{border: border}, ...headerOpts}}; 
    });
}

const getMiniHeaderArr = (miniCalHeaderOpts: CalOptions) => {
    return DAYS_OF_WEEK.map(day => { return { text: day.substring(0,1), options: miniCalHeaderOpts} });
}


/**
 * generates array to be utilized with addTable
 * @param month zero-indexed month
 * @param year the year
 * @param calOpts regular options (for normal date cells)
 * @param emptyopts for cells with no date
 * @param emptyborder the border to use with cells that are "merged"
 * @param defaultborder normal border to use
 * @returns 
 *   rowNumber - the total number of rows in table (not counting header since that isn't added by this function)
 *   topLeftCells - how many cells are before top left date starts
 *   bottomRightCells - same for bottom right
 *   rows - rows to be used with addTable
 */
const generateDaysTable = (month: number, year: number, calOpts: any, emptyopts: any, emptyborder: BorderOptions | null, defaultborder: BorderOptions | null) => {
    let date = new Date(year, month, 1);

    let monthDays = getDaysInMonth(date);

    let arr = [];

    // add extra days until we get to start day for month
    let startDay = getDay(date);
    for (let i = 0; i < startDay; i++) {
        let leftBorder = (i === 0) ? defaultborder : emptyborder;
        let rightBorder = (i === startDay - 1) ? defaultborder : emptyborder;
        let theseEmptyOpts = {...{border: [defaultborder, rightBorder, defaultborder, leftBorder]}, ...emptyopts};
        arr.push({text: '', options: theseEmptyOpts});
    }


    let topLeftCells = arr.length;

    // add items until we get through month
    let curArrDay = 1;
    for (; curArrDay <= monthDays; curArrDay++) {
        arr.push({text: curArrDay.toString(), options: calOpts});
    }

    let bottomRightCells = 0;

    // get to the end of the week
    while (arr.length % 7 !== 0) {
        let leftBorder = (curArrDay === 0) ? defaultborder : emptyborder;
        let rightBorder: BorderOptions | null = (arr.length % 7 === 6) ? defaultborder : emptyborder;
        let theseEmptyOpts: any = {...{border: [defaultborder, rightBorder, defaultborder, leftBorder]}, ...emptyopts};
        arr.push({text: '', options: theseEmptyOpts});
        bottomRightCells++;
    }

    let retRes = [];
    for (let weekIdx = 0; weekIdx < arr.length / 7; weekIdx++) {
        let portion = arr.slice(weekIdx * 7, (weekIdx + 1) * 7);
        retRes.push(portion);
    }

    return {
        rowNumber: arr.length / 7,
        topLeftCells: topLeftCells,
        bottomRightCells: bottomRightCells,
        rows: retRes
    }
}


/**
 * Resolves an image given a data url.
 * @param url The data url.
 * @returns The html img element.
 */
const getImage = async (url: string) : Promise<HTMLImageElement> => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
        let img = new Image();
        img.onload = () => resolve(img);
        img.src = url;
    });
}


/**
 * Returns a pptxgen word list object.
 * @param words The words to coalesce. 
 * @param leadingSpace True to add a leading space.
 * @returns The pptxgen object.
 */
const coalesceWords = (words: string[], leadingSpace: boolean) => {
    let retWords = words.join(" ");
    if (leadingSpace)
        retWords = " " + retWords;

    return { text: retWords, options: {breakLine: false}};
}


/**
 * Creates a pptxgen string object of the text.
 * @param str The string to format.
 * @param appendLineBreak True to append a line break.
 * @returns The formatted string object.
 */
const formattedString = (str: string, appendLineBreak: boolean) => {
    let retArr: any[] = [];

    // split on each word
    let splitArr = str.split(" ");

    // holds all the word items until we hit a superscript item (at which point, push to retArr)
    let normalWordBuffer = [];
    let afterSuperScript = false;

    for (let word of splitArr) {
        if (word.match("\\d+(?=st|nd|rd|th)")) {
            // push the first part (normal text) to normal word buffer
            normalWordBuffer.push(word.substring(0, word.length - 2));

            // coalesce all previous normal text and push to return array
            let coalesced = coalesceWords(normalWordBuffer, afterSuperScript);
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
        let coalesced = coalesceWords(normalWordBuffer, afterSuperScript);
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


/**
 * Metrics regarding text for given events.
 * @param events The events.
 * @returns 
 *      lines: number of lines
 *      text: the text
 */
const getEventMetrics = (events: DateEntry[]) => {
    let orig : {lines: number, text: any[]} = {lines: 0, text:[]};

    // get number of lines text will be and the object representing text to be added
    return events.reduce((prevMetric, curEv, index) => {
        // TODO this could be changed to better calculate total lines, but this should be fairly accurate
        let lines: number = prevMetric.lines + Math.ceil(curEv.name.length / CHARACTERS_PER_LINE);
        let items = formattedString(curEv.name, index < events.length - 1);

        for (let textItem of items)
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
const addEventImages = async (slide: any, imgs:string[], imgPlacement:Dimension) => {
    // the location where the text will end; set half way in middle of the cell (and if images are added adjust up)
    let textBottom = imgPlacement.y + imgPlacement.height / 2;

    if (imgs && imgs.length > 0) {
        // image width will be alotted width divided by number of images and alotting for spacing between images
        let imgWidth = (imgPlacement.width - (EVENT_IMAGE_SPACING * (imgs.length - 1))) / imgs.length;

        // center images in available space
        for (let ind = 0; ind < imgs.length; ind++) {
            let val = imgs[ind];

            // determine bounds for image within calendar event bounds
            let imgBounds = {
                x: imgPlacement.x + imgWidth * ind + (EVENT_IMAGE_SPACING * Math.max(0, ind - 1)),
                y: imgPlacement.y,
                width: imgWidth,
                height: imgPlacement.height
            };
            
            // maximize space while maintaining image proportions
            let img = await getImage(val);
            let resWidth, resHeight;
            if (img.width / img.height > imgBounds.width / imgBounds.height) {
                resWidth = imgBounds.width;
                resHeight = img.height * resWidth / img.width;
            }
            else {
                resHeight = imgBounds.height;
                resWidth = img.width * resHeight / img.height;
            }

            let imgx = (imgBounds.width - resWidth) / 2 + imgBounds.x;
            let imgy = (imgBounds.height - resHeight) / 2 + imgBounds.y;
            textBottom = Math.min(textBottom, imgy);

            if (img)
                slide.addImage({data: img.src, x:imgx, y:imgy, w:resWidth, h:resHeight});
        }
    }

    return textBottom;
}


/**
 * Adds events to a pptxgen slide.
 * @param slide The pptxgen slide.
 * @param eventOptions The options for the events.
 * @param events The events.
 * @param placement The dimension placement.
 */
const addEvents = async (slide: any, eventOptions: EventTextOptions, events: DateEntry[], placement: Dimension) => {
    let metrics = getEventMetrics(events);

    // how tall the text will be in pixels
    // constant taken from conversion from points to inches
    let textPixelSize = EVENT_FONT_SIZE * INCHES_TO_POINT;

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
    let imgYStart = placement.y + placement.height - availImgHeight;

    let textBottom = await addEventImages(slide, imgs, { x: placement.x, y: imgYStart, width: placement.width, height: availImgHeight });

    // place text right above highest image
    slide.addText(metrics.text, {...{ x: placement.x, y:placement.y, w:placement.width, h:textBottom - placement.y }, ...eventOptions});
}

// gives dimensions that maintain aspect ratio but bounds to maxWidth, maxHeight
/**
 * Gives dimensions that maintain aspect ratio but bounds to maxWidth, maxHeight.
 * @param origWidth The original width.
 * @param origHeight The original height.
 * @param maxWidth The maximum bounding width.
 * @param maxHeight The maximum bounding heght.
 * @returns The width and height to use.
 */
const sizeToBoundingBox = (origWidth: number, origHeight: number, maxWidth: number, maxHeight: number) => {
    let origWH = origWidth / origHeight;
    let maxWH = maxWidth / maxHeight;

    // if original width in proportion to height is greater than max width/height, then width will be maximum dimension

    // oW / oH = rW / rH
    let w,h;
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
const addMiniCalendar = (slide: any, miniCalOpts: CalOptions, miniCalHeaderOpts: CalOptions, month:number, year:number, x:number, y:number) => {
    let prevMonthCal = generateDaysTable(month,year,miniCalOpts,miniCalOpts,NO_BORDER,NO_BORDER).rows;
    prevMonthCal.unshift(getMiniHeaderArr(miniCalHeaderOpts));

    const prevDate = new Date(year, month, 1);
    const prevMonthString = `${format(prevDate, "MMM")} ${format(prevDate, "yyyy")}`;
    const spacing = {text:' ', options:miniCalOpts};
    const spacingArr = [spacing, spacing, spacing, spacing, spacing, spacing, spacing];

    prevMonthCal.unshift(spacingArr);

    const tableOptions = { x:x, y:y, w:MINI_WIDTH, rowH:MINI_HEIGHT/8, fill:'FFFFE0'};

    slide.addTable(prevMonthCal, tableOptions);
    slide.addText(prevMonthString, {...{ x:x, y:y, w:MINI_WIDTH, h:MINI_HEIGHT/8}, ...miniCalOpts});
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
const generateMiniCalendars = (slide: any, miniCalOpts: CalOptions, miniCalHeaderOpts: CalOptions, 
    x: number, rowNumber : number, topLeftCells : number, bottomRightCells : number, month: number, year: number) => {

    let prevX;
    let prevY;
    let nextX;
    let nextY;

    // width if items are next to each other
    const minisWidth = MINI_SPACING + MINI_WIDTH * 2;
    const minisYOffset = (CAL_CELL_HEIGHT - MINI_HEIGHT) / 2;
    const topRowY = CAL_Y + CAL_HEADER_HEIGHT + minisYOffset;
    const botRowY = topRowY + (rowNumber - 1) * CAL_CELL_HEIGHT;

    // determine where mini calendars go
    // if area in top left corner, place calendars there
    if (topLeftCells >= 3) {
        prevY = topRowY;
        nextY = topRowY;

        let widthAvail = topLeftCells * CAL_CELL_WIDTH;
        prevX = x + (widthAvail - minisWidth) / 2;
        nextX = prevX + MINI_WIDTH + MINI_SPACING;
    }
    // if area in bottom right corner, place calendars there
    else if (bottomRightCells >= 3) {
        prevY = botRowY;
        nextY = botRowY;

        let widthAvail = bottomRightCells * CAL_CELL_WIDTH;
        // x position of calendar and offset for bottom items then offset for centering
        prevX = x + (7 - bottomRightCells) * CAL_CELL_WIDTH + (widthAvail - minisWidth) / 2;
        nextX = prevX + MINI_WIDTH + MINI_SPACING;
    }
    // otherwise, split between top and bottom
    else {
        prevY = topRowY;
        nextY = botRowY;

        let topAvail = topLeftCells * CAL_CELL_WIDTH;
        prevX = x + (topAvail - MINI_WIDTH) / 2;

        let botAvail = bottomRightCells * CAL_CELL_WIDTH;
        nextX = x + (7 - bottomRightCells) * CAL_CELL_WIDTH + (botAvail - MINI_WIDTH) / 2;
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

    addMiniCalendar(slide, miniCalOpts, miniCalHeaderOpts, prevMonth, prevYear, prevX, prevY);
    addMiniCalendar(slide, miniCalOpts, miniCalHeaderOpts, nextMonth, nextYear, nextX, nextY);
}


/**
 * Adds a banner to a slide.
 * @param slide The slide.
 * @param imagepath The image data url
 */
const addBanner = async (slide: any, imagepath: string | undefined) => {
    if (!imagepath || imagepath.length < 1)
        return;

    let img = await getImage(imagepath);
    
    let imgDim = sizeToBoundingBox(img.width, img.height, HEADER_IMG_WIDTH, HEADER_IMG_HEIGHT);
    let imgx = (PAGE_WIDTH - imgDim.width) / 2;
    let imgy = HEADER_IMG_Y + (HEADER_IMG_HEIGHT - imgDim.height) / 2;

    if (img)
        slide.addImage({ data:img.src, x:imgx, y:imgy, w:imgDim.width, h:imgDim.height, align: 'center', valign: 'top' });
}


/**
 * Generates the monthly calendar for one slide.
 * @param slide The slide.
 * @param options The settings.
 * @param month The month.
 * @param year The year.
 * @param imagepath The banner data url.
 * @param dates object mapping the day to the date entry for a holiday.
 */
const generateMonthCalendar = async (slide: any, options: PptxSettings, month: number, year: number, 
        imagepath: string | undefined, dates: {[day: number] : DateEntry[]}) => {

    let date = new Date(year, month, 1);

    // get month string like January 2018
    let monthStr = `${format(date, "MMMM")} ${format(date, "yyyy")}`;

    await addBanner(slide, imagepath);
    
    let width = CAL_CELL_WIDTH * 7;
    let x = (PAGE_WIDTH - width ) / 2;

    slide.addText(monthStr, {...{ x:CAL_TEXT_X, y:CAL_TEXT_Y, h:CAL_TEXT_H}, ...options.titleTextOptions});

    let tabOpts = { x:x, y:CAL_Y, w:width, rowH: CAL_HEIGHTS };

    // generate primary table
    let rowData = generateDaysTable(month,year,options.bodyOptions,options.emptyOptions,NO_BORDER, options.calendarBorder);
    let rows: any[] = rowData.rows;
    let headerArr = getHeaderArr(options.headerOptions, options.calendarBorder);
    rows.unshift(headerArr);

    slide.addTable(rows, tabOpts);

    let miniCalHeaderOpts = {...options.miniCalOptions, ...{border: [NO_BORDER, NO_BORDER, options.miniCalUnderlineColor, NO_BORDER]}};
    generateMiniCalendars(slide, options.miniCalOptions, miniCalHeaderOpts, 
        x, rowData.rowNumber, rowData.topLeftCells, rowData.bottomRightCells, month, year);

    // info for creating events
    let xEventStart = x;
    let yEventStart = CAL_Y + CAL_HEADER_HEIGHT;
    let eventWidth = CAL_CELL_WIDTH;


    for (let dt in dates) {
        let dayNum = rowData.topLeftCells + parseInt(dt, 10);

        let row = Math.floor((dayNum - 1) / 7);
        let col = (dayNum - 1) % 7;

        let thisYPlacement = yEventStart;
        for (let r = 0; r<row; r++)
            thisYPlacement += EVENT_HEIGHTS[r];

        let dim = {
            x: xEventStart + col * eventWidth + eventWidth * EVENT_CAL_PADDING_PROP, 
            y: thisYPlacement + EVENT_CAL_TOP_PADDING, 
            width: Math.max(0, eventWidth * (1 - EVENT_CAL_PADDING_PROP * 2)), 
            height: Math.max(0, EVENT_HEIGHTS[row] - EVENT_CAL_TOP_PADDING - eventWidth * EVENT_CAL_PADDING_PROP)
        };

        // add events with image
        await addEvents(slide, options.eventTextOptions, dates[dt], dim);
    }
}



/**
 * Converts date entries from previous year to current year.
 * @param events The events.
 * @param year The year.
 * @returns The entries with the modified dates.
 */
const convertDateEntries = (events: DateEntry[], year: number) : DateEntry[] => {
    return events.map((dateEntry) => {
        let newString = parseNumYears(dateEntry.name, year);
        return {
            month: dateEntry.month, 
            day: dateEntry.day, 
            name: newString, 
            img: dateEntry.img
        };
    });
}

const getExtendedSettings = (settings: PptxSettings): PptxSettings => {
    return {
        ...settings,
        ...{
            headerOptions: {...settings.headerOptions, ...{fontSize:HEADER_FONT_SIZE, fontFace:settings.font}},
            bodyOptions: {...settings.bodyOptions, ...{fontSize: DATE_NUMBER_FONT_SIZE, fontFace:settings.font, border: settings.calendarBorder}},
            miniCalOptions: {...settings.miniCalOptions, ...{margin:0, fontSize:MINI_FONT_SIZE, fontFace:settings.font, border: NO_BORDER}},
            titleTextOptions: {...settings.titleTextOptions, ...{fontFace:settings.font, align: 'left', fontSize:TITLE_TEXT_SIZE}},
            eventTextOptions: {...settings.eventTextOptions, ...{fontSize:EVENT_FONT_SIZE, fontFace:settings.font, valign: 'bottom', align: 'center'}}
        }
    };
}

/**
 * Creates a powerpoint file for the calendar.
 * @param settings The powerpoint settings.
 * @param events The events.
 * @param banners The banner data urls for each month.
 * @param year The year.
 */
export const create = async (settings: PptxSettings, events: DateEntry[], banners:string[], year: number) => {
    let extendedSettings = getExtendedSettings(settings);
    let pptx = new pptxgen();
    pptx.layout = 'LAYOUT_4x3';

    let dates : {[day: number] : DateEntry[]}[] = [];

    for (let i = 0; i < 12; i++)
        dates.push({});

    for (let ev of events) {
        let thisDate = new Date(year, ev.month - 1, ev.day);

        // ensure that this item belongs in this year
        if (thisDate.getFullYear() !== year)
            continue;

        let monthItems = dates[thisDate.getMonth()];
        if (!monthItems[thisDate.getDate()])
            monthItems[thisDate.getDate()] = new Array<DateEntry>();
        
        monthItems[thisDate.getDate()].push(ev);
    }

    for (let i = 0; i < 12; i++) {
        let slide = pptx.addSlide();
        let bannerToUse = (banners && banners.length > i) ? banners[i] : undefined;
        await generateMonthCalendar(slide, extendedSettings, i, year, bannerToUse, dates[i]);
    }

    pptx.writeFile({ fileName: `${extendedSettings.pptxName}-${year.toString()}` }); 
}