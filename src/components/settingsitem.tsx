import * as React from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import ImageLoader from './imageloader';
import Checkbox from '@mui/material/Checkbox';
import ColorPicker from './colorpicker';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import { PptxSettings } from '../model';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import SmallSelect from './smallselect';

export enum VerticalAlign {
    top = "top",
    middle = "middle",
    bottom = "bottom"
}

export enum HorizontalAlign {
    left = "left",
    center = "center",
    right = "right"
}

export enum SettingsType {
    Number,
    Color,
    Image,
    Text,
    Boolean,
    VerticalAlign,
    HorizontalAlign
}


const SettingsItem = (props: {
    title: string,
    hint?: string,
    setter: (item: any) => void,
    initialValue: any,
    type: SettingsType
}) => {

    let [value, setValue] = useState(props.initialValue);

    let baseComponent = undefined;

    switch (props.type) {
        case SettingsType.Boolean:
            baseComponent = (
                <div>
                    <Checkbox
                        title={props.title + (props.hint ? (" (" + props.hint + ")") : "")}
                        checked={value}
                        onChange={(evt, checked) => {
                            props.setter(checked);
                            setValue(checked);
                        }}
                    />
                </div>
            );
            break;
        case SettingsType.HorizontalAlign:
        case SettingsType.VerticalAlign:
            let options = (props.type === SettingsType.HorizontalAlign) ?
                [
                    { text: "Left", value: HorizontalAlign.left },
                    { text: "Center", value: HorizontalAlign.center },
                    { text: "Right", value: HorizontalAlign.right }
                ] :
                [
                    { text: "Top", value: VerticalAlign.top },
                    { text: "Middle", value: VerticalAlign.middle },
                    { text: "Bottom", value: VerticalAlign.bottom }
                ];

            let items = options.map((v, i) => (
                <MenuItem value={v.value} key={"menuItem" + i.toString()}>{v.text}</MenuItem>
            ));

            baseComponent = (
                <div>
                    <SmallSelect
                        // style={{ marginLeft: '-24px', marginTop: '-10px' }}
                        variant="outlined"
                        id={props.title}
                        label={props.title + (props.hint ? (" (" + props.hint + ")") : "")}
                        title={props.title + (props.hint ? (" (" + props.hint + ")") : "")}
                        value={value}
                        onChange={evt => {
                            props.setter(evt.target.value);
                            setValue(evt.target.value);
                        }}
                    >
                        {items}
                    </SmallSelect>
                </div>
            );
            break;

        case SettingsType.Color:
            baseComponent = (
                <div>
                    <ColorPicker
                        title={props.title + (props.hint ? (" (" + props.hint + ")") : "")}
                        initialColor={value}
                        onUpdate={(v) => {
                            props.setter(v);
                            setValue(v);
                        }}
                    />
                </div>
            );
            break;

        case SettingsType.Image:
            baseComponent = (
                <ImageLoader
                    initialDataUrl={value}
                    onDataUrl={(v) => {
                        props.setter(v);
                        setValue(v);
                    }}
                    title={props.title}
                />
            );
            break;

        case SettingsType.Number:
        case SettingsType.Text:
        default:
            let textFieldType = props.type === SettingsType.Number ? "number" : undefined;

            baseComponent = (<TextField
                size='small'
                variant='outlined'
                type={textFieldType}
                value={value}
                title={props.title}
                label={props.title}
                onChange={(e) => {
                    props.setter(e.target.value);
                    setValue(e.target.value);
                }}
            />);
            break;
    }

    return (
        <div style={{ margin: '10px 0px' }}>
            {baseComponent}
        </div>
    )
}


const SettingsCard = (props: {
    title: string,
    subtitle?: string,
    children?: any,
    [key: string]: any
}) => {
    let { title, subtitle, children, ...rest } = props;

    return (
        // <Card sx={{ maxWidth: 345 }}>
        <Card {...{...{style: {margin: ".5rem"}}, ...rest}}>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {title}
                </Typography>
                {subtitle &&
                    <Typography gutterBottom variant="body2" component="div" style={{ fontStyle: "italic" }} color="text.secondary">
                        {subtitle}
                    </Typography>}
                <div>
                    {children}
                </div>
            </CardContent>
        </Card>
    );
}




const AllFormatSettings = (props: {
    model: PptxSettings, //{[key: string]: any},
    onChange: (model: PptxSettings) => void
}) => {

    let { model, onChange } = props;
    let updateField = (ancestorFields: string[], value: any) => {
        let copiedModel: PptxSettings = structuredClone(model);
        let currParent: any = copiedModel;
        for (let i = 0; i < ancestorFields.length - 1; i++) {
            let field = ancestorFields[i];
            currParent = currParent[field];
        }

        currParent[ancestorFields[ancestorFields.length - 1]] = value;
        onChange(copiedModel);
    }

    let getField = (onSettingsUpdate: (newVal: any) => void, initialVal: any, type: SettingsType, title: string, hintText: string | undefined = undefined) => {
        return (
            <div className="SettingsItem">
                <SettingsItem
                    title={title}
                    setter={onSettingsUpdate}
                    initialValue={initialVal}
                    type={type}
                    hint={hintText}
                />
            </div>
        );
    }

    let getPt = (onSettingsUpdate: (newVal: any) => void, initialVal: any, title: string, hintText: string | undefined = undefined) => {
        return (
            <div className="SettingsItem">
                <SettingsItem
                    title={title}
                    setter={onSettingsUpdate}
                    initialValue={parseInt(initialVal, 10)}
                    type={SettingsType.Number}
                    hint={hintText}
                />
            </div>
        );
    }

    const paperStyle = {
        padding: 10,
        margin: 10
    };

    return (
        <Grid container spacing={3}>
            <Grid sm={12} md={6} lg={4}>
                <SettingsCard title="General">
                    {getField((newName) => updateField(["pptxName"], newName),
                        model.pptxName, SettingsType.Text, "PowerPoint File Name")}
                    {getField((newFont) => updateField(["font"], newFont),
                        model.font, SettingsType.Text, "Font Type", "Power Point Font Type")}
                    {getField((newFill) => updateField(["emptyOptions", "fill"], newFill),
                        model.emptyOptions.fill, SettingsType.Color, "Color of Empty Table Cells")}
                    {getField((newColor) => updateField(["eventTextOptions", "color"], newColor),
                        model.eventTextOptions.color, SettingsType.Color, "Event Text Color",
                        "i.e. the color of the text for 'Christmas Day'")}
                </SettingsCard>
            </Grid>
            <Grid sm={12} md={6} lg={4}>
                <SettingsCard title="Calendar Border">
                    {getPt((newPt) => updateField(["calendarBorder", "pt"], newPt),
                        model.calendarBorder.pt, "Width", "in points")}
                    {getField((newColor) => updateField(["calendarBorder", "color"], newColor),
                        model.calendarBorder.color, SettingsType.Color, "Color")}
                </SettingsCard>
            </Grid>
            <Grid sm={12} md={6} lg={4}>
                <SettingsCard title="Calendar Header" subtitle="(i.e. Sunday, Monday, Tuesday)">
                    {getField((newVal) => updateField(["headerOptions", "valign"], newVal),
                        model.headerOptions.valign, SettingsType.VerticalAlign, "Vertical Alignment")}
                    {getField((newVal) => updateField(["headerOptions", "align"], newVal),
                        model.headerOptions.align, SettingsType.HorizontalAlign, "Horizontal Alignment")}
                    {getField((newVal) => updateField(["headerOptions", "fill"], newVal),
                        model.headerOptions.fill, SettingsType.Color, "Background Color")}
                    {getField((newVal) => updateField(["headerOptions", "color"], newVal),
                        model.headerOptions.color, SettingsType.Color, "Text Color")}
                </SettingsCard>
            </Grid>
            <Grid sm={12} md={6} lg={4}>
                <SettingsCard title="Calendar Number" subtitle="(i.e. the '21' for the date in a box)">
                    {getField((newVal) => updateField(["bodyOptions", "align"], newVal),
                        model.bodyOptions.align, SettingsType.HorizontalAlign, "Horizontal Alignment")}
                    {getField((newVal) => updateField(["bodyOptions", "color"], newVal),
                        model.bodyOptions.color, SettingsType.Color, "Color")}
                    {getField((newVal) => updateField(["bodyOptions", "fill"], newVal),
                        model.bodyOptions.fill, SettingsType.Color, "Fill")}
                    {getField((newVal) => updateField(["bodyOptions", "italic"], newVal),
                        model.bodyOptions.italic, SettingsType.Boolean, "Italicize Text")}
                </SettingsCard>
            </Grid>
            <Grid sm={12} md={6} lg={4}>
                <SettingsCard title="Miniature Calendar Options" subtitle="(i.e. if the month is February, the smaller calendar for March)">
                    {getField((newVal) => updateField(["miniCalOptions", "valign"], newVal),
                        model.miniCalOptions.valign, SettingsType.VerticalAlign, "Vertical Alignment in Empty Space")}
                    {getField((newVal) => updateField(["miniCalOptions", "align"], newVal),
                        model.miniCalOptions.align, SettingsType.HorizontalAlign, "Horizontal Alignment in EmptySpace")}
                    {getField((newVal) => updateField(["miniCalOptions", "color"], newVal),
                        model.miniCalOptions.color, SettingsType.Color, "Color")}
                    {getField((newVal) => updateField(["miniCalOptions", "fill"], newVal),
                        model.miniCalOptions.fill, SettingsType.Color, "Fill")}
                    {getPt((newVal) => updateField(["miniCalUnderlineColor", "pt"], newVal),
                        model.miniCalUnderlineColor.pt, "Header Border Width", "the seperator between the header items like 'M', 'T', etc. in points")}
                    {getField((newVal) => updateField(["miniCalUnderlineColor", "color"], newVal),
                        model.miniCalUnderlineColor.color, SettingsType.Color, "Header Border Color", "the color of the line seperating the header")}
                </SettingsCard>
            </Grid>
            <Grid sm={12} md={6} lg={4}>
                <SettingsCard title="Calendar Title Text" subtitle="(i.e. like 'January')">
                    {getField((newVal) => updateField(["titleTextOptions", "valign"], newVal),
                        model.titleTextOptions.valign, SettingsType.VerticalAlign, "Vertical Alignment in Empty Space")}
                    {getField((newVal) => updateField(["titleTextOptions", "color"], newVal),
                        model.titleTextOptions.color, SettingsType.Color, "Color")}
                </SettingsCard>
            </Grid>
        </Grid>
    );
}

export default AllFormatSettings;