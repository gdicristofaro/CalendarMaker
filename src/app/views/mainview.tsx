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
import { useRouter } from 'next/navigation';
import { EVENTS_PATH, FORMAT_SETTINGS_PATH, BANNERS_PATH } from '../model/routes';

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

export default (props: { slug: string }) => {
    let context = useContext(ModelContext);
    
    let { slug } = props;
    const router = useRouter()

    let tabComponent;
    switch (slug) {
        case FORMAT_SETTINGS_PATH:
            tabComponent = (<FormatSettingsView {...context} />);
            break;
        case BANNERS_PATH:
            tabComponent = (<BannersView {...context} />);
            break;
        default:
            tabComponent = (<EventsView {...context} />);
            break;
    }
    
    return (
        <div className="min-h-screen flex flex-col">
            <Header {...context} />
            <Paper className="grow m-3 p-3">
                <Tabs 
                    onChange={(_, newVal) => router.push(newVal)} 
                    value={slug} 
                    style={TAB_STYLES.tabsRoot}
                >
                    <Tab
                        label="Events Settings"
                        icon={<EventIcon />}
                        iconPosition='start'
                        value={EVENTS_PATH}
                        style={TAB_STYLES.tabRoot}
                    />
                    <Tab
                        label="Banners"
                        icon={<PhotoIcon />}
                        iconPosition='start'
                        value={BANNERS_PATH}
                        style={TAB_STYLES.tabRoot}
                    />
                    <Tab
                        label="Formatting Settings"
                        icon={<DisplaySettingsIcon />}
                        iconPosition='start'
                        value={FORMAT_SETTINGS_PATH}
                        style={TAB_STYLES.tabRoot}
                    />
                </Tabs>
                <Box sx={{ p: 3 }}>
                    {tabComponent}
                </Box>
            </Paper>
            <div className="grow-0 flex-none">
                <ResetButton reset={() => context.update(DefaultSettings)} />
            </div>
        </div>
    );
}
