import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import ImageLoader from './imageloader';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { DesktopDatePicker as DatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DateEventModel, DateTypeInfo, DAYS, MONTHS, WEEK_NUMBER } from '../model';
import { Dayjs } from 'dayjs';
import Paper from '@mui/material/Paper';
import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const INPUT_COMP_STYLE = {margin: '0 .5rem'};

/**
 * generates a date selector (i.e. January 10)
 * @param month the month (1 is January)
 * @param day the day of the month
 * @param onUpdate Function to call when value is updated.
 */
const getDateSelector = (month: number, day: number, onUpdate: (updated: DateTypeInfo) => void) => {
    return (
        <div style={CELL_STYLE}>
            <DatePicker
                label="Date for Event"
                value={new Date(new Date().getFullYear(), month - 1, day)}
                onChange={(value: Dayjs | null) => value && onUpdate({
                    dateType: "Date",
                    month: value.month() + 1,
                    dayNum: value.date()
                })}
                renderInput={(params) => <TextField {...{...{variant: 'standard'}, ...params}} />}
            />
        </div>
    );
}


/**
 * generates a weekday of week of month selector (i.e. 3rd Sunday of May)
 * @param month the month (1 is January)
 * @param week the week number (1 is 1st week)
 * @param dayOfWeek the day of the week (0 is Sunday)
 * @param onUpdate When info is updated
 */
const getWeekdayMonthSelector = (month: number, week: number, dayOfWeek: number, onUpdate: (dateItem: DateTypeInfo) => void) => {
    return (
        <div>
            <div style={CELL_STYLE}>
                <Select
                    label="Month"
                    title="Month"
                    variant="standard"
                    value={month}
                    onChange={(evt) => onUpdate({
                        dateType: 'WeekdayMonth',
                        month: evt.target.value as number,
                        dayOfWeek,
                        week
                    }
                    )}
                >
                    {MONTHS.map((val, ind) => {
                        return (
                            <MenuItem key={"monthSelector" + ind.toString()} value={ind + 1}>
                                {val}
                            </MenuItem>
                        )
                    })}
                </Select>
            </div>
            <div style={CELL_STYLE}>
                <Select
                    title="Day"
                    variant="standard"
                    style={{ marginLeft: '-24px', marginTop: '-10px' }}
                    value={dayOfWeek}
                    onChange={(evt) => onUpdate({
                        dateType: 'WeekdayMonth',
                        month,
                        dayOfWeek: evt.target.value as number,
                        week
                    })}
                >
                    {DAYS.map((val, ind) => {
                        return (
                            <MenuItem key={"daySelector" + ind.toString()} value={ind}>
                                {val}
                            </MenuItem>
                        )
                    })}
                </Select>
            </div>
            <div style={CELL_STYLE}>
                <Select
                    title="Week Number"
                    variant='standard'
                    value={week}
                    onChange={(evt) => onUpdate({
                        dateType: 'WeekdayMonth',
                        month,
                        dayOfWeek,
                        week: evt.target.value as number
                    })}
                >
                    {WEEK_NUMBER.map((val, ind) => {
                        return (
                            <MenuItem key={"weekNumSelector" + ind.toString()} value={ind + 1}>
                                {val}
                            </MenuItem>
                        )
                    })}
                </Select>
            </div>
        </div>
    );
}

/**
 * the day of the week before a certain day (i.e. Sunday before July 3rd)
 * @param month the month (1 is January)
 * @param date the day of the month
 * @param dayOfWeek the day of the week (0 is Sunday)
 * @param onUpdate When info is updated
 */
const getWeekdayBeforeSelector = (month: number, date: number, dayOfWeek: number, onUpdate: (updated: DateTypeInfo) => void) => {
    return (
        <div>
            <div style={CELL_STYLE}>
                <DatePicker
                    label="Select Date For Event"
                    value={new Date(new Date().getFullYear(), month - 1, date)}
                    onChange={(value: Dayjs | null) => value && onUpdate({
                        dateType: 'WeekdayBefore',
                        month: value.month() + 1,
                        date: value.date(),
                        dayOfWeek
                    })}
                    renderInput={(params) => <TextField {...{...{variant: 'standard'}, ...params}} />}
                />
            </div>
            <div style={CELL_STYLE}>
                <Select
                    title='Month'
                    variant='standard'
                    value={dayOfWeek}
                    onChange={(evt) => onUpdate({
                        dateType: 'WeekdayBefore',
                        month,
                        date,
                        dayOfWeek: evt.target.value as number
                    })}
                >
                    {DAYS.map((val, ind) => {
                        return (
                            <MenuItem value={ind} key={"weekdaybefore" + ind.toString()}>
                                {val}
                            </MenuItem>
                        )
                    })}
                </Select>
            </div>
        </div>
    );
}


const getCustomSelector = (dateString: string, onUpdate: (updated: DateTypeInfo) => void) => {
    return (
        <div style={CELL_STYLE}>
            <TextField
                variant='standard'
                value={dateString}
                label="Custom Date"
                onChange={(evt) => onUpdate({ dateType: 'Custom', identifier: evt.target.value })}
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


const getDateTypeComponent = (dateInfo: DateTypeInfo, onUpdate: (updated: DateTypeInfo) => void) => {
    switch (dateInfo.dateType) {
        case 'Date':
            return getDateSelector(dateInfo.month, dateInfo.dayNum, onUpdate);
        case 'WeekdayMonth':
            return getWeekdayMonthSelector(dateInfo.month, dateInfo.week, dateInfo.dayOfWeek, onUpdate);
        case 'WeekdayBefore':
            return getWeekdayMonthSelector(dateInfo.month, dateInfo.date, dateInfo.dayOfWeek, onUpdate);
        case 'Custom':
            return getCustomSelector(dateInfo.identifier, onUpdate);
    }
}

// defines a calendar event
const DateEvent = (props: {
    onDelete: () => void,
    model: DateEventModel,
    onUpdate: (updated: DateEventModel) => void
}) => {
    let { model, onUpdate, onDelete } = props;

    let dateTypeInfoUpdate = (updatedDateInfo: DateTypeInfo) => {
        onUpdate({ ...model, dateInfo: updatedDateInfo });
    };

    let dateTypeComponent = getDateTypeComponent(
        model.dateInfo,
        dateTypeInfoUpdate
    );


    return (
        <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{model.eventName}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <div style={{ display: 'flex' }}>
                <div style={{flexGrow: 1}}>
                    <div>
                        <TextField
                            variant='standard'
                            value={model.eventName}
                            onChange={(evt) => {
                                let value = evt.target.value || "";
                                onUpdate({ ...model, ...{ eventName: value } });
                            }}
                            label="Event Name"
                            title="Event Name"
                            style={INPUT_COMP_STYLE}
                        />

                        <Select
                            title="Date Type"
                            label="Date Type"
                            variant='standard'
                            value={model.dateInfo.dateType}
                            onChange={(evt) => {
                                let val = evt.target.value;
                                switch (val) {
                                    case "WeekdayMonth":
                                        dateTypeInfoUpdate({
                                            dateType: "WeekdayMonth",
                                            dayOfWeek: 1,
                                            month: 1, 
                                            week: 1
                                        })
                                        break;
                                    case "WeekdayBefore":
                                        dateTypeInfoUpdate({
                                            dateType: "WeekdayBefore",
                                            date: 1,
                                            dayOfWeek: 1, 
                                            month: 1
                                        });
                                        break;
                                    case "Custom":
                                        dateTypeInfoUpdate({
                                            dateType: 'Custom',
                                            identifier: "Easter"
                                        });
                                        break;
                                    case "Date":
                                        dateTypeInfoUpdate({
                                            dateType: "Date",
                                            dayNum: 1,
                                            month: 1
                                        })
                                        break;
                                };
                            }}
                            autoWidth={true}
                            style={INPUT_COMP_STYLE}
                        >
                            <MenuItem value="Date">Date</MenuItem>
                            <MenuItem value="WeekdayMonth">Day of the Week for Week Number of Month</MenuItem>
                            <MenuItem value="WeekdayBefore">Day of the Week Before Date</MenuItem>
                            <MenuItem value="Custom">Custom Moment-Holiday Text</MenuItem>
                        </Select>
                    </div>
                    <div>
                        {dateTypeComponent}
                    </div>
                </div>
                <div>
                    <ImageLoader
                        title="Choose Image..."
                        initialDataUrl={props.model.imageDataUrl || ""}
                        onDataUrl={(durl) => {
                            onUpdate({ ...model, ...{ imageDataUrl: durl } });
                        }}
                    />
                </div>
            </div>
            
        

            <IconButton
                // iconStyle={{width: 48, height: 48}}
                style={{ width: 96, height: 96, padding: 20 }}
                onClick={() => onDelete()}
            >
            <DeleteIcon />
            </IconButton>
        </AccordionDetails>
    </Accordion>);
};

export default DateEvent;