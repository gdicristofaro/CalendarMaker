import * as React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import {ImageLoader, ImageLoaderProps} from './ImageLoader';
import Checkbox from 'material-ui/Checkbox';
import PptxGen from '../PptxGen';
import {ColorPicker, ColorPickerProps} from './ColorPicker';
import Paper from 'material-ui/Paper';
import { SmallLabel } from './SmallLabel';

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

export class SettingsProps {
    Title: string;
    Hint: string = undefined;
    Setter: (item: any) => void;
    Value: any;
    Type: SettingsType;
}

export class SettingsItem extends React.Component<SettingsProps, undefined> {
    getTextFieldComp(type) {
        return (
            <TextField
                type={type}
                value={this.props.Value}
                floatingLabelText= {this.props.Title}
                hintText={this.props.Hint}
                onChange={(e,v) => { this.props.Setter(v); this.setState({Value: v});}}
            />
        );
    }

    getMenu(choices : {text: string, value: any}[]) {
        let items = choices.map((v,i) => (<MenuItem value={v.value} primaryText={v.text} key={"menuItem" + i.toString()} />));

        return (
            <div>
                <SmallLabel Text={this.props.Title + (this.props.Hint ? (" (" + this.props.Hint + ")") : "")} />
                <DropDownMenu 
                    style={{marginLeft: '-24px', marginTop: '-10px'}} 
                    value={this.props.Value} 
                    onChange={(e,i,d) => {this.props.Setter(d); this.setState({Value: d}); }}
                >
                    {items}
                </DropDownMenu>
            </div>
        );       
    }

    getBaseComponent() {
        switch (this.props.Type) {
            case SettingsType.Boolean:
                return (
                    <div>
                        <SmallLabel Text={this.props.Title + (this.props.Hint ? (" (" + this.props.Hint + ")") : "")} />
                        <Checkbox
                            checked={this.props.Value}
                            onCheck={() => { 
                                let val = !this.props.Value; 
                                this.props.Setter(val);
                            }}
                        />
                    </div>
                );
                
            case SettingsType.HorizontalAlign:
                return this.getMenu([
                    {text: "Left", value: HorizontalAlign.left},
                    {text: "Center", value: HorizontalAlign.center},
                    {text: "Right", value: HorizontalAlign.right}]);

            case SettingsType.VerticalAlign:
                return this.getMenu([
                    {text: "Top", value: VerticalAlign.top},
                    {text: "Middle", value: VerticalAlign.middle},
                    {text: "Bottom", value: VerticalAlign.bottom}]);

            case SettingsType.Color:
                return (
                    <div>
                        <SmallLabel Text={this.props.Title + (this.props.Hint ? (" (" + this.props.Hint + ")") : "")} />
                        <ColorPicker
                            initialColor={this.props.Value}
                            onUpdate={(v) => {this.props.Setter(v); }}
                        />
                    </div>
                );
            case SettingsType.Image:
                return (
                    <ImageLoader
                        initialDataUrl={this.props.Value}
                        onDataUrl={this.props.Setter}
                        title={this.props.Title}
                    />
                );
            case SettingsType.Number: 
                return this.getTextFieldComp("number")
            case SettingsType.Text:
            default:
                return this.getTextFieldComp(undefined);
        }
    }

    render() {
        return (
            <div style={{margin: '10px 0px'}}>
                {this.getBaseComponent()}
            </div>
        )
    }
}

export class AllFormatSettingsProps {
    model: any;
    onChange: () => void;
}



export class AllFormatSettings extends React.Component<AllFormatSettingsProps, undefined> {
    private get(parentObject: object, key: string, type: SettingsType, title: string, hintText: string = undefined) {
        return (
            <div className="SettingsItem">
                <SettingsItem
                    Title={title}
                    Setter={(v) => { parentObject[key] = v; this.props.onChange(); }}
                    Value={parentObject[key]}
                    Type={type}
                    Hint={hintText}
                />
            </div>
        );
    }

    private getPt(parentObject: object, key: string, title: string, hintText: string = undefined) {
        return (
            <div className="SettingsItem">
                <SettingsItem
                    Title={title}
                    Setter={(v) => { parentObject[key] = v.toString(); this.props.onChange(); }}
                    Value={parseInt(parentObject[key], 10)}
                    Type={SettingsType.Number}
                    Hint={hintText}
                />
            </div>
        );
    }

    render() {
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
                    {this.get(this.props.model, "pptxName" ,SettingsType.Text, "PowerPoint File Name")}
                    {this.get(this.props.model, "font" ,SettingsType.Text, "Font Type", "Power Point Font Type")}
                    {this.get(this.props.model.emptyOptions, "fill" ,SettingsType.Color, "Color of Empty Table Cells")}
                    {this.get(this.props.model.eventTextOptions, "color" ,SettingsType.Color, "Event Text Color", "(i.e. the color of the text for 'Christmas Day')")}
                </Paper>
                <Paper style={paperStyle}>
                    <div style={{margin: "10px 0px"}}>
                        <h2 style={{margin: 0}}>Calendar Border</h2>
                    </div>
                    {this.getPt(this.props.model.calendarBorder, "pt", "Width", "in points")}
                    {this.get(this.props.model.calendarBorder, "color" ,SettingsType.Color, "Color")}
                </Paper>
                <Paper style={paperStyle}>
                    <div style={{margin: "10px 0px"}}>
                        <h2 style={{margin: 0}}>Calendar Header</h2>
                        <span style={{fontFamily: 'Roboto, sans-serif', fontStyle: 'italic'}}>(i.e. Sunday, Monday, Tuesday)</span>
                    </div>
                    {this.get(this.props.model.headerOptions, "valign" ,SettingsType.VerticalAlign, "Vertical Alignment")}
                    {this.get(this.props.model.headerOptions, "align" ,SettingsType.HorizontalAlign, "Horizontal Alignment")}
                    {this.get(this.props.model.headerOptions, "fill" ,SettingsType.Color, "Background Color")}
                    {this.get(this.props.model.headerOptions, "color" ,SettingsType.Color, "Text Color")}
                </Paper>
                <Paper style={paperStyle}>
                    <div style={{margin: "10px 0px"}}>                    
                        <h2 style={{margin: 0}}>Calendar Number</h2>
                        <span style={{fontFamily: 'Roboto, sans-serif', fontStyle: 'italic'}}>(i.e. the "21" for the date in a box)</span>
                    </div>
                    {this.get(this.props.model.bodyOptions, "align" ,SettingsType.HorizontalAlign, "Horizontal Alignment")}
                    {this.get(this.props.model.bodyOptions, "color" ,SettingsType.Color, "Color")}
                    {this.get(this.props.model.bodyOptions, "fill" ,SettingsType.Color, "Fill")}
                    {this.get(this.props.model.bodyOptions, "italic", SettingsType.Boolean, "Italicize Text")}
                </Paper>
                <Paper style={paperStyle}>
                    <div style={{margin: "10px 0px"}}>                    
                        <h2 style={{margin: 0}}>Miniature Calendar Options</h2>
                        <span style={{fontFamily: 'Roboto, sans-serif', fontStyle: 'italic'}}>(i.e. if the month is February, the smaller calendar for March)</span>
                    </div>
                    {this.get(this.props.model.miniCalOptions, "valign" ,SettingsType.VerticalAlign, "Vertical Alignment in Empty Space")}
                    {this.get(this.props.model.miniCalOptions, "align" ,SettingsType.HorizontalAlign, "Horizontal Alignment in EmptySpace")}
                    {this.get(this.props.model.miniCalOptions, "color" ,SettingsType.Color, "Color")}
                    {this.get(this.props.model.miniCalOptions, "fill" ,SettingsType.Color, "Fill")}
                    {this.getPt(this.props.model.miniCalUnderlineColor, "pt", "Header Border Width", "the seperator between the header items like 'M', 'T', etc. in points")}
                    {this.get(this.props.model.miniCalUnderlineColor, "color" ,SettingsType.Color, "Header Border Color", "the color of the line seperating the header")}
                </Paper>

                <Paper style={paperStyle}>
                    <div style={{margin: "10px 0px"}}>    
                        <h2 style={{margin: 0}}>Calendar Title Text</h2>
                        <span style={{fontFamily: 'Roboto, sans-serif', fontStyle: 'italic'}}>(i.e. like 'January')</span>
                    </div>
                    {this.get(this.props.model.titleTextOptions, "valign" ,SettingsType.VerticalAlign, "Vertical Alignment in Empty Space")}
                    {this.get(this.props.model.titleTextOptions, "color" ,SettingsType.Color, "Color")}
                </Paper>
            </div>
        );
    }
}