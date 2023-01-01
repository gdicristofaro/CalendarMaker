import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from "@mui/material/Button"
import AllFormatSettings from './settingsitem';
import DateEvent from './dateevent';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import ImageLoader from './imageloader';
import { create as pptxCreate } from '../pptxgen'
import { } from '../parseholiday';
import download from 'downloadjs';
import {DateEntry, DateEventModel, DefaultSettings, MONTHS, SettingsModel} from '../model';
import Dialog from '@mui/material/Dialog';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useContext, useState } from 'react';
import { ModelContext } from '../modelcontext';
import { Box, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }


const MainComponent = (props: {}) => {

    let [tabIdx, setTabIdx] = useState(0);
    let [showReset, setShowReset] = useState(false);
    let context = useContext(ModelContext);

    let dateComps = context.settings?.events.map((val,i,arr) => {
        return (
            <DateEvent
                model = {val}
                key= {"datecomp" + i.toString()}
                onUpdate={(updateEvt) => {
                    let copiedSettings : SettingsModel = structuredClone(context.settings);
                    copiedSettings.events[i] = updateEvt;
                    context.update(copiedSettings);
                }}
                onDelete={() => { 
                    let copiedSettings : SettingsModel = structuredClone(context.settings);
                    copiedSettings.events.splice(i,1);
                    context.update(copiedSettings);
                }}
            />
        );
    });
    
    let bannerComps = MONTHS.map((val,i,arr) => {
        let initialBannerDataUrl : string = (context.settings.banners as any)[val] || "";
        return (
            <div key={"bannerDiv" + i.toString()} style={{margin: 20, display: 'inline-block', verticalAlign: 'top'}}>
                <ImageLoader
                    initialDataUrl={initialBannerDataUrl}
                    key= {"banneritem" + i.toString()}
                    onDataUrl={(durl) => { 
                        let copiedSettings : SettingsModel = structuredClone(context.settings);
                        (copiedSettings.banners as any)[val] = durl;
                        context.update(copiedSettings);
                    }}
                    title={"Choose banner for " + arr[i] + "..."}
                />
            </div>
        );
    });

    let settingsLoad = (selectorFiles: FileList | null) => {
        if (!selectorFiles || selectorFiles.length <= 0)
            return;
    
        let file = selectorFiles[0];
        let fileType = file.type.toUpperCase().trim();

        let reader = new FileReader();

        reader.addEventListener("load", 
            () => {
                if (reader.result) {
                    let extended = {...DefaultSettings, ...JSON.parse(reader.result as string) };
                    context.update(extended);
                }
            }
        );
        reader.readAsText(file);
    };


    let pptxHandler = (e: any) => {
        let settings = context.settings;
        let year = settings.year;
        let events: DateEntry[] = settings.events.map((val) => {
            let date = parseHoliday(val.dateString + "/" + year.toString(), false);
            return {
                month: date.getMonth() + 1, 
                day: date.getDate(), 
                name: val.eventName,
                img: val.imageDataUrl || ""
            }
        });

        let banners: any[] = MONTHS.map((val) => (settings.banners as any)[val]);

        pptxCreate(settings.formatting, events, banners, settings.year);
    };

    let formatSettings = context.settings.formatting;

    return (
        <div>
            <Button
                title='Load Settings'
                style={{margin: 10}}
                // containerElement='label'
            >
                <input type="file" onChange={ (e) => settingsLoad(e.target.files)} style={{display: 'none'}}/>
            </Button>
            <Button 
                title="Save Settings" 
                style={{margin: 10}} 
                onClick={(e)=> download(JSON.stringify(context.settings), "settings.json", "application/json")} 
            />
            <Button 
                title="Create PowerPoint File" 
                style={{margin: 10}} 
                onClick={pptxHandler} 
            />
            <TextField
                title="Year for Calendar"
                type="number"
                onChange={(e) => {
                    let copiedSettings : SettingsModel = structuredClone(context.settings);
                    copiedSettings.year = parseInt(e.target.value,10);
                    context.update(copiedSettings);
                }}
                value={(context.settings.year) ? context.settings.year : new Date().getFullYear() + 1}
                style={{paddingLeft: '10px'}}
            />
            <Paper>
                <Tabs value={tabIdx} onChange={(evt, newVal) => setTabIdx(newVal)}>
                    <Tab label="Formatting Settings" value={0} />
                    <Tab label="Events Settings" value={1} />
                    <Tab label="Banners" value={2} />
                </Tabs>
                <TabPanel index={0} value={tabIdx}>
                    <AllFormatSettings model={formatSettings} onChange={(newSettings) => {
                        let copiedSettings : SettingsModel = structuredClone(context.settings);
                        copiedSettings.formatting = newSettings;
                        context.update(copiedSettings);
                    }}/>
                </TabPanel>
                <TabPanel index={1} value={tabIdx}>
                    {dateComps}
                    <div style={{padding: '5px'}}>
                        <Button 
                            title="Add New Event" 
                            onClick={(e)=> {
                                let dateEvtModel : DateEventModel = {
                                    dateString: "1/1",
                                    eventName: "Event Name",
                                    imageDataUrl: undefined
                                }

                                let copiedSettings : SettingsModel = structuredClone(context.settings);
                                copiedSettings.events.push(dateEvtModel);
                                context.update(copiedSettings);
                            }} 
                        />
                    </div>
                </TabPanel>
                <TabPanel index={2} value={tabIdx}>
                    {bannerComps}
                </TabPanel>
            </Paper>
            <Button
                style={{margin: 10}}
                title="Clear All Settings"
                onClick={() => setShowReset(true)}
            />
            <Dialog
                open={showReset}
                onClose={() => setShowReset(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Reset All Settings?
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to reset all settings?  This will delete all current events as well.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={() => setShowReset(false)}>Cancel</Button>
                <Button 
                    onClick={() => { 
                        context.update(DefaultSettings); 
                        setShowReset(false);
                    }}
                    autoFocus
                >
                    Agree
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default MainComponent;