import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import { DefaultSettings } from '../model/model';
import React, { useContext, useState } from 'react';
import { ModelContext } from '../model/modelcontext';
import { Box } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import PhotoIcon from '@mui/icons-material/Photo';
import BannersView from './bannersview';
import FormatSettingsView from './formatsettingsview';
import EventsView from './eventsview';
import Header from '../components/header';
import ResetButton from '../components/resetbutton';


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

const MainComponent = () => {
    let [tabIdx, setTabIdx] = useState(0);
    let context = useContext(ModelContext);

    return (
        <div className="min-h-screen flex flex-col">
            <Header {...context} />
            <Paper className="grow m-3 p-3">
                <Tabs value={tabIdx} onChange={(_, newVal) => setTabIdx(newVal)} style={TAB_STYLES.tabsRoot}>
                    <Tab label="Formatting Settings" icon={<DisplaySettingsIcon />} iconPosition='start' value={0} style={TAB_STYLES.tabRoot}/>
                    <Tab label="Events Settings" icon={<EventIcon />} iconPosition='start' value={1} style={TAB_STYLES.tabRoot}/>
                    <Tab label="Banners" icon={<PhotoIcon />} iconPosition='start' value={2} style={TAB_STYLES.tabRoot}/>
                </Tabs>
                <TabPanel index={0} value={tabIdx}>
                    <FormatSettingsView {...context} />
                </TabPanel>
                <TabPanel index={1} value={tabIdx}>
                    <EventsView {...context} />
                </TabPanel>
                <TabPanel index={2} value={tabIdx}>
                    <BannersView  {...context} />
                </TabPanel>
            </Paper>
            <div className="grow-0 flex-none">
                <ResetButton reset={() => context.update(DefaultSettings) } />
            </div>
        </div>
    );
}

export default MainComponent;