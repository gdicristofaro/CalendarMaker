import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import FlatButton from "@mui/material/Button"
import RaisedButton from "@mui/material/Button"
import AllFormatSettings from './settingsitem';
import DateEvent from './dateevent';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import ImageLoader from './imageloader';
import { create as pptxCreate } from '../pptxgen'
import { } from '../parseholiday';
import * as download from 'downloadjs';
import {DateEntry, DateEventModel, DefaultSettings, MONTHS, SettingsModel} from '../model';
import Dialog from '@mui/material/Dialog';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useContext } from 'react';
import { ModelContext } from '../modelcontext';



const MainComponent = (props: {
    // settings: SettingsModel,
    showResetDialog: boolean
}) => {

    let cookieSettings = localStorage.getItem('settings');
    let context = useContext(ModelContext);


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


    let dateComps = context.settings?.events.map((val,i,arr) => {
        return (
            <DateEvent
                model = {val}
                key= {"datecomp" + i.toString()}
                onUpdate={() => this.saveSettings()}
                onDelete = {() => { arr.splice(i,1); this.forceUpdate();}}
            />
        );
    });
    
    let bannerComps = MONTHS.map((val,i,arr) => {
        return (
            <div key={"bannerDiv" + i.toString()} style={{margin: 20, display: 'inline-block', verticalAlign: 'top'}}>
                <ImageLoader
                    initialDataUrl={context.settings?.banners?[val] || "" }
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
                let extended = {...DefaultSettings, ...JSON.parse(reader.result) };
                this.setState({settings: extended })
            }
        );
        reader.readAsText(file);
    };


    let pptxHandler = (e: any) => {
        let settings = context.settings;
        let year = settings.year;
        let events = settings.events.map((val) => {
            let date = parseHoliday(val.dateString + "/" + year.toString(), false);
            return {
                month: date.getMonth() + 1, 
                date: date.getDate(), 
                name: val.eventName,
                image: val.imageDataUrl
            }
        });

        let banners: any[] = MONTHS.map((val) => settings.banners[val]);

        pptxCreate(settings.formatting, events, banners, settings.year);
    };

    let formatSettings = context.settings.formatting;

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