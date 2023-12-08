import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from "@mui/material/Button"
import AllFormatSettings from './settingsitem';
import DateEvent from './dateevent';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import ImageLoader from './imageloader';
import { create as pptxCreate } from '../model/pptxgen'
import { parseHoliday } from '../model/parseholiday';
import download from 'downloadjs';
import { DateEntry, DateEventModel, DefaultSettings, MONTHS, SettingsModel } from '../model/model';
import Dialog from '@mui/material/Dialog';
import React, { useContext, useState } from 'react';
import { ModelContext } from '../model/modelcontext';
import { Box, DialogActions, DialogContent, DialogContentText, DialogTitle, makeStyles } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ArticleIcon from '@mui/icons-material/Article';
import EventIcon from '@mui/icons-material/Event';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import PhotoIcon from '@mui/icons-material/Photo';


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
                    {children}
                </Box>
            )}
        </div>
    );
}

let TAB_HEIGHT = '40px';

let TAB_STYLES = {
  tabsRoot: {
    minHeight: TAB_HEIGHT,
    height: TAB_HEIGHT
  },
  tabRoot: {
    minHeight: TAB_HEIGHT,
    height: TAB_HEIGHT

  }
};

const MainComponent = (props: {}) => {

    let [tabIdx, setTabIdx] = useState(0);
    let [showReset, setShowReset] = useState(false);
    let context = useContext(ModelContext);

    let dateComps = context.settings?.events.map((val, i, arr) => {
        return (
            <DateEvent
                id={"event_" + i}
                model={val}
                key={"datecomp" + i.toString()}
                onUpdate={(updateEvt) => {
                    let copiedSettings: SettingsModel = structuredClone(context.settings);
                    copiedSettings.events[i] = updateEvt;
                    context.update(copiedSettings);
                }}
                onDelete={() => {
                    let copiedSettings: SettingsModel = structuredClone(context.settings);
                    copiedSettings.events.splice(i, 1);
                    context.update(copiedSettings);
                }}
            />
        );
    });

    let bannerComps = MONTHS.map((val, i, arr) => {
        let initialBannerDataUrl: string = context?.settings?.banners[val] || "";
        return (
            <div key={"bannerDiv" + i.toString()} style={{ margin: 20, display: 'inline-block', verticalAlign: 'top' }}>
                <ImageLoader
                    initialDataUrl={initialBannerDataUrl}
                    key={"banneritem" + i.toString()}
                    onDataUrl={(durl) => {
                        let copiedSettings: SettingsModel = structuredClone(context.settings);
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

        let reader = new FileReader();

        reader.addEventListener("load",
            () => {
                if (reader.result) {
                    let extended = { ...DefaultSettings, ...JSON.parse(reader.result as string) };
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
            let date = parseHoliday(val.dateInfo, year);
            return {
                month: date.month,
                day: date.date,
                name: val.eventName,
                img: val.imageDataUrl || ""
            }
        });

        let banners: any[] = MONTHS.map((val) => (settings.banners as any)[val]);

        pptxCreate(settings.formatting, events, banners, settings.year);
    };

    let formatSettings = context?.settings?.formatting;

    return (
        <div>
            <Button
                variant='outlined'
                component='label'
                startIcon={<FileUploadIcon />}
                style={{ margin: 10 }}
            >
                Load Settings
                <input type="file" onChange={(e) => settingsLoad(e.target.files)} style={{ display: 'none' }} />
            </Button>
            <Button
                variant='outlined'
                component='label'
                startIcon={<FileDownloadIcon />}
                style={{ margin: 10 }}
                onClick={(e) => download(JSON.stringify(context.settings), "settings.json", "application/json")}
            >
                Save Settings
            </Button>
            <Button
                variant="outlined"
                style={{ margin: 10 }}
                startIcon={<ArticleIcon />}
                onClick={pptxHandler}
            >
                Create PowerPoint File
            </Button>
            <TextField
                size='small'
                variant='outlined'
                title="Year for Calendar"
                label="Year for Calendar"
                type="number"
                onChange={(e) => {
                    let copiedSettings: SettingsModel = structuredClone(context.settings);
                    copiedSettings.year = parseInt(e.target.value, 10);
                    context.update(copiedSettings);
                }}
                value={(context?.settings?.year) ? context.settings.year : new Date().getFullYear() + 1}
                style={{ paddingLeft: '10px' }}
            />
            <Paper>
                <Tabs value={tabIdx} onChange={(evt, newVal) => setTabIdx(newVal)} style={TAB_STYLES.tabsRoot}>
                    <Tab label="Formatting Settings" icon={<DisplaySettingsIcon />} iconPosition='start' value={0} style={TAB_STYLES.tabRoot}/>
                    <Tab label="Events Settings" icon={<EventIcon />} iconPosition='start' value={1} style={TAB_STYLES.tabRoot}/>
                    <Tab label="Banners" icon={<PhotoIcon />} iconPosition='start' value={2} style={TAB_STYLES.tabRoot}/>
                </Tabs>
                <TabPanel index={0} value={tabIdx}>
                    <AllFormatSettings model={formatSettings} onChange={(newSettings) => {
                        let copiedSettings: SettingsModel = structuredClone(context.settings);
                        copiedSettings.formatting = newSettings;
                        context.update(copiedSettings);
                    }} />
                </TabPanel>
                <TabPanel index={1} value={tabIdx}>
                    {dateComps}
                    <div style={{ padding: '5px' }}>
                        <Button
                            variant='outlined'
                            onClick={(e) => {
                                let dateEvtModel: DateEventModel = {
                                    dateInfo: {
                                        dateType: 'Date',
                                        month: 1,
                                        dayNum: 1
                                    },
                                    eventName: "Event Name",
                                    imageDataUrl: undefined
                                }

                                let copiedSettings: SettingsModel = structuredClone(context.settings);
                                copiedSettings.events.push(dateEvtModel);
                                context.update(copiedSettings);
                            }}
                        >
                            Add New Event
                        </Button>
                    </div>
                </TabPanel>
                <TabPanel index={2} value={tabIdx}>
                    {bannerComps}
                </TabPanel>
            </Paper>
            <Button
                variant='outlined'
                style={{ margin: 10 }}
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
                    <Button variant='outlined' onClick={() => setShowReset(false)}>Cancel</Button>
                    <Button variant='outlined'
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