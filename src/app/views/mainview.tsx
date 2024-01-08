import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import { DefaultSettings } from '../model/model';
import React, { useContext, useState } from 'react';
import { ModelContext } from '../model/modelcontext';
import { Box, CssBaseline, Typography } from '@mui/material';
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
        // <div className="min-h-screen flex flex-col">
        <Box>
            <CssBaseline />
            <Header {...{...context, ...props}} />
            <Box className="p-2">
                {/* {tabComponent} */}
            </Box>
        </Box>
    );
}
