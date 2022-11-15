import * as React from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import ImageLoader from './ImageLoader';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { DesktopDatePicker as DatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import Paper from '@mui/material/Paper';
import * as $ from 'jquery';
import SmallLabel from './SmallLabel';
import {DateEventModel} from '../Model';

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


const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const weekNumber = ["1st","2nd","3rd","4th","5th"];


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

// for cells containing text changing elements
const CELL_STYLE = {
    padding: '0px 10px',
    display: 'table-cell',
    verticalAlign: 'bottom',
};



// defines a calendar event
const DateEvent = (props: {
    onDelete: () => void,
    Model: DateEventModel,
    onUpdate() : void
}) => {


    constructor(props: DateEventProps) {
        super(props);

        let dateData = DateEvent.matchDate(this.props.Model.dateString).dateType;
        this.state = {dateType: dateData};
    }

    /**
     * when date string changes, this should be called
     * @param newDateString the new date string
     */
    private onDateString(newDateString: string, forceUpdate: boolean = true) : void {
        this.props.Model.dateString = newDateString;
        this.props.onUpdate(); 

        if (forceUpdate)
            this.forceUpdate();
    }


    /**
     * generates a date selector (i.e. January 10)
     * @param month the month (1 is January)
     * @param day the day of the month
     */
    private getDateSelector(month: number, day: number) {
        return (
            <div style={DateEvent.CELL_STYLE}>
                <DatePicker
                    floatingLabelText="Date for Event"
                    hintText="Select Date For Event"
                    disableYearSelection={true}
                    formatDate={(date:Date) => `${DateEvent.months[date.getMonth()]} ${date.getDate()}`}
                    onChange={(value: unknown, keyboardInputValue?: string) => this.onDateString(`${date.getMonth() + 1}/${date.getDate()}`) }
                    defaultDate={new Date(new Date().getFullYear(), month - 1, day)}
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
    private getWeekdayMonthSelector(month: number, weekNumber: number, dayOfWeek: number) {
        return (
            <div>
                <div style={DateEvent.CELL_STYLE}>
                    <SmallLabel Text="Month" />
                    <DropDownMenu 
                        style={{marginLeft: '-24px', marginTop: '-10px'}} 
                        value={month} 
                        onChange={(e,i,val) => this.onDateString(`${val}/(${dayOfWeek},${weekNumber})`)}
                    >
                        {DateEvent.months.map((val,ind) => { return (<MenuItem key={"monthSelector" + ind.toString()} value={ind + 1} primaryText={val}/>)})}
                    </DropDownMenu>
                </div>
                <div style={DateEvent.CELL_STYLE}>
                    <SmallLabel Text="Day of the Week" />
                    <DropDownMenu 
                        style={{marginLeft: '-24px', marginTop: '-10px'}} 
                        value={dayOfWeek} 
                        onChange={(e,i,val) => this.onDateString(`${month}/(${val},${weekNumber})`)}
                    >
                        {DateEvent.days.map((val,ind) => { return (<MenuItem key={"daySelector" + ind.toString()} value={ind} primaryText={val}/>)})}
                    </DropDownMenu>
                </div>
                <div style={DateEvent.CELL_STYLE}>
                    <SmallLabel Text="Week Number of Month" />
                    <DropDownMenu 
                        style={{marginLeft: '-24px', marginTop: '-10px'}} 
                        value={ weekNumber } 
                        onChange={(e,i,val) => this.onDateString(`${month}/(${dayOfWeek},${val})`)}
                    >
                        {DateEvent.weekNumber.map((val,ind) => { return (<MenuItem key={"weekNumSelector" + ind.toString()} value={ind+1} primaryText={val}/>)})}
                    </DropDownMenu>
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
    private getWeekdayBeforeSelector(month: number, day: number, dayOfWeek: number) {
        return (
            <div>
                <div style={DateEvent.CELL_STYLE}>
                    <DatePicker
                        floatingLabelText="Pick Date for Event"
                        hintText="Select Date For Event"
                        disableYearSelection={true}
                        formatDate={(date:Date) => `${DateEvent.months[date.getMonth()]} ${date.getDate()}`}
                        onChange={(n, date:Date) => this.onDateString(`${date.getMonth() + 1}/(${dayOfWeek},[-${date.getDate()}])`) }
                        defaultDate={new Date(new Date().getFullYear(), month - 1, day)}
                    />
                </div>
                <div style={DateEvent.CELL_STYLE}>
                    <SmallLabel Text="Month" />
                    <DropDownMenu 
                        style={{marginLeft: '-24px', marginTop: '-10px'}} 
                        value={dayOfWeek} 
                        onChange={(e,i,val) => this.onDateString(`${month}/(${val},[-${day}])`) }
                    >
                        {DateEvent.days.map((val,ind) => { return (<MenuItem value={ind} key={"weekdaybefore" + ind.toString()} primaryText={val}/>)})}
                    </DropDownMenu>
                </div>
            </div>
        );
    }


    private getCustomSelector(dateString: string) {
        return (
            <div style={DateEvent.CELL_STYLE}>
                <TextField
                    hintText="Name" 
                    value={dateString} 
                    floatingLabelText="Custom Date"
                    onChange={(e,d) => this.onDateString(d) }
                />
            </div>
        );
    }



    let dateString = this.props.Model.dateString;

    let matchRecord = DateEvent.matchDate(dateString);
    
    let month = matchRecord.month ? matchRecord.month : 1;
    let day = matchRecord.day ? matchRecord.day : 1;
    let week = matchRecord.week ? matchRecord.week : 1;
    let weekday = matchRecord.weekday ? matchRecord.weekday : 0;

    let DateSelector;
    switch (state.dateType) {
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

    let dropdownChange = (e,i,val) => {
        let newDateString;
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
        setState({dateType: val});
    };

    return (
        <div style={{padding: '10px', margin: '10px'}}>
            <div style={DateEvent.CELL_STYLE}>
                <TextField 
                    hintText="Name" 
                    value={this.props.Model.eventName} 
                    onChange={(e,v) => {this.props.Model.eventName = v; this.props.onUpdate(); this.forceUpdate();}} 
                    floatingLabelText="Event Name" 
                />
            </div>
            <div style={$.extend({}, DateEvent.CELL_STYLE, {
                width: '256px',
                position: 'relative' })}
            >
                <SmallLabel Text="Date Type" />
                <Select 
                    style={{marginLeft: '-24px', marginTop: '-10px'}}
                    value={this.state.dateType} 
                    onChange={dropdownChange}
                    autoWidth={true}
                >
                    <MenuItem value={DateType.Date}>Date</MenuItem>
                    <MenuItem value={DateType.WeekdayMonth}>Day of the Week for Week Number of Month</MenuItem>
                    <MenuItem value={DateType.WeekdayBefore}>Day of the Week Before Date</MenuItem>
                    <MenuItem value={DateType.Custom}>Custom Moment-Holiday Text</MenuItem>
                </Select>
            </div>
            <div style={DateEvent.CELL_STYLE}>
                {DateSelector}
            </div>
            <div style={DateEvent.CELL_STYLE}>
                <ImageLoader 
                    title="Choose Image..." 
                    initialDataUrl={this.props.Model.imageDataUrl} 
                    onDataUrl={(durl) => {this.props.Model.imageDataUrl = durl; this.props.onUpdate(); this.forceUpdate();}}
                />
            </div>
            <div style={DateEvent.CELL_STYLE}>
                <IconButton
                    iconStyle={{width: 48, height: 48}}
                    style={{width: 96, height: 96, padding: 20}}
                    onClick={() => this.props.onDelete()}
                >
                    <ActionDelete />
                </IconButton>
            </div>
        </div>
    );
};

export default DateEvent;