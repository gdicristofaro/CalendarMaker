import * as React from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import ImageLoader from './ImageLoader';
import Checkbox from '@mui/material/Checkbox';
import PptxGen from '../PptxGen';
import ColorPicker from './ColorPicker';
import Paper from '@mui/material/Paper';
import SmallLabel from './SmallLabel';
import { useState } from 'react';

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
    value: any,
    type: SettingsType
}) => {
    
    let textFieldComponent = (
            <TextField
                type={type}
                value={props.value}
                floatingLabelText= {props.title}
                hintText={props.hint}
                onChange={(e: any, v: string) => { props.setter(v); setValue(v);}}
            />
        );

    // getMenu(choices : {text: string, value: any}[]) {
    //     let items = choices.map((v,i) => (<MenuItem value={v.value} primaryText={v.text} key={"menuItem" + i.toString()} />));

    //     return (
    //         <div>
    //             <SmallLabel Text={this.props.Title + (this.props.Hint ? (" (" + this.props.Hint + ")") : "")} />
    //             <DropDownMenu 
    //                 style={{marginLeft: '-24px', marginTop: '-10px'}} 
    //                 value={this.props.Value} 
    //                 onChange={(e,i,d) => {this.props.Setter(d); this.setState({Value: d}); }}
    //             >
    //                 {items}
    //             </DropDownMenu>
    //         </div>
    //     );       
    // }

    // getBaseComponent() {
    //     switch (this.props.Type) {
    //         case SettingsType.Boolean:
    //             return (
    //                 <div>
    //                     <SmallLabel Text={this.props.Title + (this.props.Hint ? (" (" + this.props.Hint + ")") : "")} />
    //                     <Checkbox
    //                         checked={this.props.Value}
    //                         onCheck={() => { 
    //                             let val = !this.props.Value; 
    //                             this.props.Setter(val);
    //                         }}
    //                     />
    //                 </div>
    //             );
                
    //         case SettingsType.HorizontalAlign:
    //             return this.getMenu([
    //                 {text: "Left", value: HorizontalAlign.left},
    //                 {text: "Center", value: HorizontalAlign.center},
    //                 {text: "Right", value: HorizontalAlign.right}]);

    //         case SettingsType.VerticalAlign:
    //             return this.getMenu([
    //                 {text: "Top", value: VerticalAlign.top},
    //                 {text: "Middle", value: VerticalAlign.middle},
    //                 {text: "Bottom", value: VerticalAlign.bottom}]);

    //         case SettingsType.Color:
    //             return (
    //                 <div>
    //                     <SmallLabel Text={this.props.Title + (this.props.Hint ? (" (" + this.props.Hint + ")") : "")} />
    //                     <ColorPicker
    //                         initialColor={this.props.Value}
    //                         onUpdate={(v) => {this.props.Setter(v); }}
    //                     />
    //                 </div>
    //             );
    //         case SettingsType.Image:
    //             return (
    //                 <ImageLoader
    //                     initialDataUrl={this.props.Value}
    //                     onDataUrl={this.props.Setter}
    //                     title={this.props.Title}
    //                 />
    //             );
    //         case SettingsType.Number: 
    //             return this.getTextFieldComp("number")
    //         case SettingsType.Text:
    //         default:
    //             return this.getTextFieldComp(undefined);
    //     }
    // }

    return (
        <div style={{margin: '10px 0px'}}>
            {this.getBaseComponent()}
        </div>
    )
}






const AllFormatSettings = (props: {
    model: {[key: string]: any},
    onChange: (model: {[key: string]: any}) => void
}) => {
    

    let getField = (parentObject: {[key: string]: any}, key: string, type: SettingsType, title: string, hintText?: string = undefined) => {
        return (
            <div className="SettingsItem">
                <SettingsItem
                    title={title}
                    setter={(v) => { parentObject[key] = v; props.onChange(parentObject); }}
                    value={parentObject[key]}
                    type={type}
                    hint={hintText}
                />
            </div>
        );
    }

    let getPt = (parentObject: {[key: string]: any}, key: string, title: string, hintText?: string = undefined) => {
        return (
            <div className="SettingsItem">
                <SettingsItem
                    title={title}
                    setter={(v) => { parentObject[key] = v.toString(); props.onChange(parentObject); }}
                    value={parseInt(parentObject[key], 10)}
                    type={SettingsType.Number}
                    hint={hintText}
                />
            </div>
        );
    }

    const paperStyle ={
        padding: 10,
        margin: 10
    };

    return (
        <div>
            <Paper style={paperStyle}>
                <div style={{margin: "10px 0px"}}>
                    <h2 style={{margin: 0}}>General</h2>
                </div>
                {getField(props.model, "pptxName" ,SettingsType.Text, "PowerPoint File Name")}
                {getField(props.model, "font" ,SettingsType.Text, "Font Type", "Power Point Font Type")}
                {getField(props.model.emptyOptions, "fill" ,SettingsType.Color, "Color of Empty Table Cells")}
                {getField(props.model.eventTextOptions, "color" ,SettingsType.Color, "Event Text Color", "(i.e. the color of the text for 'Christmas Day')")}
            </Paper>
            <Paper style={paperStyle}>
                <div style={{margin: "10px 0px"}}>
                    <h2 style={{margin: 0}}>Calendar Border</h2>
                </div>
                {getPt(props.model.calendarBorder, "pt", "Width", "in points")}
                {getField(props.model.calendarBorder, "color" ,SettingsType.Color, "Color")}
            </Paper>
            <Paper style={paperStyle}>
                <div style={{margin: "10px 0px"}}>
                    <h2 style={{margin: 0}}>Calendar Header</h2>
                    <span style={{fontFamily: 'Roboto, sans-serif', fontStyle: 'italic'}}>(i.e. Sunday, Monday, Tuesday)</span>
                </div>
                {getField(props.model.headerOptions, "valign" ,SettingsType.VerticalAlign, "Vertical Alignment")}
                {getField(props.model.headerOptions, "align" ,SettingsType.HorizontalAlign, "Horizontal Alignment")}
                {getField(props.model.headerOptions, "fill" ,SettingsType.Color, "Background Color")}
                {getField(props.model.headerOptions, "color" ,SettingsType.Color, "Text Color")}
            </Paper>
            <Paper style={paperStyle}>
                <div style={{margin: "10px 0px"}}>                    
                    <h2 style={{margin: 0}}>Calendar Number</h2>
                    <span style={{fontFamily: 'Roboto, sans-serif', fontStyle: 'italic'}}>(i.e. the "21" for the date in a box)</span>
                </div>
                {getField(props.model.bodyOptions, "align" ,SettingsType.HorizontalAlign, "Horizontal Alignment")}
                {getField(props.model.bodyOptions, "color" ,SettingsType.Color, "Color")}
                {getField(props.model.bodyOptions, "fill" ,SettingsType.Color, "Fill")}
                {getField(props.model.bodyOptions, "italic", SettingsType.Boolean, "Italicize Text")}
            </Paper>
            <Paper style={paperStyle}>
                <div style={{margin: "10px 0px"}}>                    
                    <h2 style={{margin: 0}}>Miniature Calendar Options</h2>
                    <span style={{fontFamily: 'Roboto, sans-serif', fontStyle: 'italic'}}>(i.e. if the month is February, the smaller calendar for March)</span>
                </div>
                {getField(props.model.miniCalOptions, "valign" ,SettingsType.VerticalAlign, "Vertical Alignment in Empty Space")}
                {getField(props.model.miniCalOptions, "align" ,SettingsType.HorizontalAlign, "Horizontal Alignment in EmptySpace")}
                {getField(props.model.miniCalOptions, "color" ,SettingsType.Color, "Color")}
                {getField(props.model.miniCalOptions, "fill" ,SettingsType.Color, "Fill")}
                {getPt(props.model.miniCalUnderlineColor, "pt", "Header Border Width", "the seperator between the header items like 'M', 'T', etc. in points")}
                {getField(props.model.miniCalUnderlineColor, "color" ,SettingsType.Color, "Header Border Color", "the color of the line seperating the header")}
            </Paper>

            <Paper style={paperStyle}>
                <div style={{margin: "10px 0px"}}>    
                    <h2 style={{margin: 0}}>Calendar Title Text</h2>
                    <span style={{fontFamily: 'Roboto, sans-serif', fontStyle: 'italic'}}>(i.e. like 'January')</span>
                </div>
                {getField(props.model.titleTextOptions, "valign" ,SettingsType.VerticalAlign, "Vertical Alignment in Empty Space")}
                {getField(props.model.titleTextOptions, "color" ,SettingsType.Color, "Color")}
            </Paper>
        </div>
    );
}