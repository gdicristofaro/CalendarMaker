import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import FlatButton from "@mui/material/Button"
import RaisedButton from "@mui/material/Button"
import AllFormatSettings from './settingsitem';
import DateEvent from './dateevent';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import ImageLoader from './imageloader';
import { DateEntry, create as pptxCreate } from '../pptxgen'
import { } from '../parseholiday';
import * as download from 'downloadjs';
import {DateEventModel, SettingsModel} from '../model';
import Dialog from '@mui/material/Dialog';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';
import useLocalStorage from '../utils/localstoragehook';



const MainComponent = (props: {
    // settings: SettingsModel,
    showResetDialog: boolean
}) => {


    let cookieSettings = localStorage.getItem('settings');


    // this.state = {
    //     settings: (cookieSettings) ? JSON.parse(cookieSettings) : new SettingsModel(),
    //     showResetDialog: false
    // };

    // saveSettings() {
    //     localStorage.setItem('settings', JSON.stringify(this.state.settings));
    // }

    // componentDidUpdate(prevProps: Readonly<undefined>, prevState: Readonly<MainComponentState>, prevContext: any) {
    //     //console.log("settings updating...", this.state.settings.Formatting, new SettingsModel().Formatting);
    //     this.saveSettings();
    // }


    let dateComps = this.state.settings.Events.map((val,i,arr) => {
        return (
            <DateEvent
                Model = {val}
                key= {"datecomp" + i.toString()}
                onUpdate={() => this.saveSettings()}
                onDelete = {() => { arr.splice(i,1); this.forceUpdate();}}
            />
        );
    });
    
    let bannerComps = DateEvent.months.map((val,i,arr) => {
        return (
            <div key={"bannerDiv" + i.toString()} style={{margin: 20, display: 'inline-block', verticalAlign: 'top'}}>
                <ImageLoader
                    initialDataUrl={this.state.settings.Banners[val]}
                    key= {"banneritem" + i.toString()}
                    onDataUrl={(durl) => { this.state.settings.Banners[val] = durl; this.forceUpdate(); }}
                    title={"Choose banner for " + arr[i] + "..."}
                />
            </div>
        );
    });

    let settingsLoad = (selectorFiles: FileList) => {
        if (!selectorFiles || selectorFiles.length <= 0)
            return;
    
        let file = selectorFiles[0];
        let fileType = file.type.toUpperCase().trim();

        let reader = new FileReader();

        reader.addEventListener("load", 
            () => {
                var extended = $.extend(true, {}, new SettingsModel(), JSON.parse(reader.result));
                this.setState({settings: extended });
            }
        );
        reader.readAsText(file);
    };


    let pptxHandler = (e)=> {
        var s = this.state.settings;
        var year = s.Year;
        var events = s.Events.map((val) => {
            var date = ParseHoliday.parse(val.dateString + "/" + year.toString(), undefined);
            return new DateEntry(date.getMonth() + 1, date.getDate(), val.eventName, val.imageDataUrl);
        });

        let banners = DateEvent.months.map((val) => s.Banners[val]);

        pptxCreate(s.Formatting, events, banners, s.Year);
    };

    let formatSettings = this.state.settings.Formatting;

    return (
        <div>
            <RaisedButton
                style={{margin: 10}}
                containerElement='label'
                label="Load Settings">
                <input type="file" onChange={ (e) => settingsLoad(e.target.files)} style={{display: 'none'}}/>
            </RaisedButton>
            <RaisedButton label="Save Settings" 
                style={{margin: 10}} 
                onClick={(e)=> download(JSON.stringify(this.state.settings), "settings.json", "application/json")} 
            />
            <RaisedButton label="Create PowerPoint File" style={{margin: 10}} onClick={pptxHandler} />
            <TextField
                floatingLabelText="Year for Calendar"
                type="number"
                onChange={(e,d) => {this.state.settings.Year = parseInt(d,10); this.forceUpdate(); }}
                value={(this.state.settings.Year) ? this.state.settings.Year : new Date().getFullYear() + 1}
                style={{paddingLeft: '10px'}}
            />
            <Paper>
                <Tabs>
                    <Tab label="Formatting Settings" value={0}>
                        <AllFormatSettings model ={formatSettings} onChange={() => this.forceUpdate()}/>
                    </Tab>
                    <Tab label="Events Settings" value={1}>
                        {dateComps}
                        <div style={{padding: '5px'}}>
                            <RaisedButton 
                                label="Add New Event" 
                                onClick={(e)=> {
                                    var de = new DateEventModel();
                                    de.DateString = "1/1";
                                    de.EventName = "Event Name";
                                    de.ImageDataUrl = undefined;
                                    this.state.settings.Events.push(de);
                                    this.forceUpdate();
                                }} 
                            />
                        </div>
                    </Tab>
                    <Tab label="Banners" value={2}>
                        {bannerComps}
                    </Tab>
                </Tabs>
            </Paper>
            <RaisedButton
                style={{margin: 10}}
                label="Clear All Settings"
                onClick={() => this.setState({showResetDialog: true})}
            />
            <Dialog
                title="Reset All Settings?"
                actions={[
                    (<FlatButton
                        label="Cancel"
                        primary={true}
                        onClick={() => this.setState({showResetDialog: false})}
                    />),
                    (<FlatButton
                    label="Ok"
                    primary={true}
                    keyboardFocused={true}
                    onClick={() => this.setState({settings: new SettingsModel(), showResetDialog: false})}
                    />),
                ]}
                    modal={false}
                    open={this.state.showResetDialog}
                    onRequestClose={() => this.setState({showResetDialog: false})}
            >
                Are you sure you want to reset all settings?  This will delete all current events as well.
            </Dialog>
        </div>
    );
}

export default MainComponent;