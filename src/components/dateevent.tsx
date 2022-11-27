import * as React from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import ImageLoader from './imageloader';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { DesktopDatePicker as DatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import SmallLabel from './smalllabel';
import {DateEventModel} from '../model';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

export interface DateTypeInfo {
    dateType: DateType,
    month?: number,
    weekday?: number,
    day?: number,
    week?: number
}

enum DateType {
    Date,
    WeekdayMonth,
    WeekdayBefore,
    Custom
}


const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const WEEK_NUMBER = ["1st","2nd","3rd","4th","5th"];


const matchDate = (dateString: string) : DateTypeInfo => { 
    // match day of week before date
    let beforeDateRegex = /([0-9]{1,2})\/\(([0-9]),\[-([0-9]{1,2})\]\)/g;
    let beforeDateMatch = beforeDateRegex.exec(dateString);
    if (beforeDateMatch) {
        return {
            dateType: DateType.WeekdayBefore,
            month: parseInt(beforeDateMatch[1],10),
            weekday: parseInt(beforeDateMatch[2],10),
            day: parseInt(beforeDateMatch[3],10),
            week: undefined
        };
    }

    // match day of week of month
    let dayOfWeekRegex = /([0-9]{1,2})\/\(([0-9]),([0-9])\)/g;
    let dayOfWeekMatch = dayOfWeekRegex.exec(dateString);
    if (dayOfWeekMatch) {
        console.log("dayOfWeekMatch", dayOfWeekMatch)
        return {
            dateType: DateType.WeekdayMonth,
            month: parseInt(dayOfWeekMatch[1],10),
            weekday: parseInt(dayOfWeekMatch[2],10),
            day: undefined,
            week: parseInt(dayOfWeekMatch[3],10)
        };
    }

    // match date 
    let dateRegex = /([0-9]{1,2})\/([0-9]{1,2})/g;
    let dateMatch = dateRegex.exec(dateString);
    if (dateMatch) {
        return {
            dateType: DateType.Date,
            month: parseInt(dateMatch[1],10),
            day: parseInt(dateMatch[2],10),
            weekday: undefined,
            week: undefined
        };
    }

    return {
        dateType: DateType.Custom,
        month: undefined,
        day: undefined,
        weekday: undefined,
        week: undefined
    };
}


/**
 * when date string changes, should be called
 * @param newDateString the new date string
 */
const onDateString = (newDateString: string, forceUpdate: boolean = true) => {
    props.model.dateString = newDateString;
    props.onUpdate(); 

    if (forceUpdate)
        forceUpdate();
}


/**
 * generates a date selector (i.e. January 10)
 * @param month the month (1 is January)
 * @param day the day of the month
 */
const getDateSelector = (month: number, day: number) => {
    return (
        <div style={CELL_STYLE}>
            <DatePicker
                label="Date for Event"
                value={new Date(new Date().getFullYear(), month - 1, day)}
                onChange={(value: Dayjs | null) => value && onDateString(`${value.month() + 1}/${value.date()}`) }
                renderInput={(params) => <TextField {...params} />}
            />
        </div>
    );
}


/**
 * generates a weekday of week of month selector (i.e. 3rd Sunday of May)
 * @param month the month (1 is January)
 * @param weekNumber the week number (1 is 1st week)
 * @param dayOfWeek the day of the week (0 is Sunday)
 */
const getWeekdayMonthSelector = (month: number, weekNumber: number, dayOfWeek: number) => {
    return (
        <div>
            <div style={CELL_STYLE}>
                <SmallLabel text="Month" />
                <Select 
                    style={{marginLeft: '-24px', marginTop: '-10px'}} 
                    value={month} 
                    onChange={(evt) => onDateString(`${evt.target.value}/(${dayOfWeek},${weekNumber})`)}
                >
                    {MONTHS.map((val,ind) => { return (
                        <MenuItem key={"monthSelector" + ind.toString()} value={ind + 1}>
                            {val}
                        </MenuItem> 
                    )})}
                </Select>
            </div>
            <div style={CELL_STYLE}>
                <SmallLabel text="Day of the Week" />
                <Select 
                    style={{marginLeft: '-24px', marginTop: '-10px'}} 
                    value={dayOfWeek} 
                    onChange={(evt) => onDateString(`${month}/(${evt.target.value},${weekNumber})`)}
                >
                    {DAYS.map((val,ind) => { return (
                        <MenuItem key={"daySelector" + ind.toString()} value={ind}>
                            {val}
                        </MenuItem>
                    )})}
                </Select>
            </div>
            <div style={CELL_STYLE}>
                <SmallLabel text="Week Number of Month" />
                <Select 
                    style={{marginLeft: '-24px', marginTop: '-10px'}} 
                    value={ weekNumber } 
                    onChange={(evt) => onDateString(`${month}/(${dayOfWeek},${evt.target.value})`)}
                >
                    {WEEK_NUMBER.map((val,ind) => { return (
                        <MenuItem key={"weekNumSelector" + ind.toString()} value={ind+1}>
                            {val}
                        </MenuItem>
                    )})}
                </Select>
            </div>
        </div>
    );
}

/**
 * the day of the week before a certain day (i.e. Sunday before July 3rd)
 * @param month the month (1 is January)
 * @param day the day of the month
 * @param dayOfWeek the day of the week (0 is Sunday)
 */
const getWeekdayBeforeSelector = (month: number, day: number, dayOfWeek: number) => {
    return (
        <div>
            <div style={CELL_STYLE}>
                <DatePicker
                    label="Select Date For Event"
                    value={new Date(new Date().getFullYear(), month - 1, day)}
                    onChange={(value: Dayjs | null) => value && onDateString(`${value.month() + 1}/(${dayOfWeek},[-${value.date()}])`) }
                    renderInput={(params) => <TextField {...params} />}
                />
            </div>
            <div style={CELL_STYLE}>
                <SmallLabel text="Month" />
                <Select 
                    style={{marginLeft: '-24px', marginTop: '-10px'}} 
                    value={dayOfWeek} 
                    onChange={(evt) => onDateString(`${month}/(${evt.target.value},[-${day}])`) }
                >
                    {DAYS.map((val,ind) => { return (
                        <MenuItem value={ind} key={"weekdaybefore" + ind.toString()}>
                            {val}
                        </MenuItem>
                    )})}
                </Select>
            </div>
        </div>
    );
}


const getCustomSelector = (dateString: string) => {
    return (
        <div style={CELL_STYLE}>
            <TextField
                value={dateString} 
                label="Custom Date"
                onChange={(evt) => onDateString(evt.target.value) }
            />
        </div>
    );
}



// for cells containing text changing elements
const CELL_STYLE = {
    padding: '0px 10px',
    display: 'table-cell',
    verticalAlign: 'bottom',
};



// defines a calendar event
const DateEvent = (props: {
    onDelete: () => void,
    model: DateEventModel,
    onUpdate() : void
}) => {
    let [dateType, setDateType] = useState(matchDate(props.model.dateString).dateType); 



    let dateString = props.model.dateString;

    let matchRecord = matchDate(dateString);
    
    let month = matchRecord.month ? matchRecord.month : 1;
    let day = matchRecord.day ? matchRecord.day : 1;
    let week = matchRecord.week ? matchRecord.week : 1;
    let weekday = matchRecord.weekday ? matchRecord.weekday : 0;

    let DateSelector;
    switch (dateType) {
        case DateType.Date:
            DateSelector = getDateSelector(month, day);
            break;
        case DateType.WeekdayMonth:
            DateSelector = getWeekdayMonthSelector(month, week, weekday);
            break;
        case DateType.WeekdayBefore:
            DateSelector = getWeekdayBeforeSelector(month, day, weekday);
            break;
        case DateType.Custom:
        default:
            DateSelector = getCustomSelector(dateString);
    }

    return (
        <div style={{padding: '10px', margin: '10px'}}>
            <div style={CELL_STYLE}>
                <TextField 
                    // hintText="Name" 
                    value={props.model.eventName} 
                    onChange={(evt) => {
                        let value = evt.target.textContent;
                        props.model.eventName = value; 
                        props.onUpdate();
                        forceUpdate();
                    }} 
                    title="Event Name" 
                />
            </div>
            <div style={{...CELL_STYLE, ...{
                width: '256px',
                position: 'relative' }}}
            >
                <SmallLabel text="Date Type" />
                <Select 
                    style={{marginLeft: '-24px', marginTop: '-10px'}}
                    value={dateType} 
                    onChange={(evt) => {
                        let val = evt.target.value;
                        let newDateString: string = '';
                        switch (val) {
                            case DateType.WeekdayMonth:
                                newDateString = `${month}/(${weekday},${week})`;
                                break;
                            case DateType.WeekdayBefore:
                                newDateString = `${month}/(${weekday},[-${day}])`;
                                break;
                            case DateType.Custom:
                            case DateType.Date:
                                newDateString = `${month}/${day}`;
                                break;
                        };
                
                        console.log(newDateString);
                        onDateString(newDateString, false);
                        setDateType(val);
                    }}
                    autoWidth={true}
                >
                    <MenuItem value={DateType.Date}>Date</MenuItem>
                    <MenuItem value={DateType.WeekdayMonth}>Day of the Week for Week Number of Month</MenuItem>
                    <MenuItem value={DateType.WeekdayBefore}>Day of the Week Before Date</MenuItem>
                    <MenuItem value={DateType.Custom}>Custom Moment-Holiday Text</MenuItem>
                </Select>
            </div>
            <div style={CELL_STYLE}>
                {DateSelector}
            </div>
            <div style={CELL_STYLE}>
                <ImageLoader 
                    title="Choose Image..." 
                    initialDataUrl={props.model.imageDataUrl} 
                    onDataUrl={(durl) => {
                        props.model.imageDataUrl = durl; 
                        props.onUpdate(); 
                        forceUpdate();
                    }}
                />
            </div>
            <div style={CELL_STYLE}>
                <IconButton
                    // iconStyle={{width: 48, height: 48}}
                    // style={{width: 96, height: 96, padding: 20}}
                    onClick={() => props.onDelete()}
                >
                    <DeleteIcon />
                </IconButton>
            </div>
        </div>
    );
};

export default DateEvent;