"use client";

import React, { useContext } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ModelContext, ModelContextComponent } from "../model/modelcontext";
import { CssBaseline, Box } from "@mui/material";
import Header from "../components/header";
import { BANNERS_PATH, EVENTS_PATH, FORMAT_SETTINGS_PATH } from "../model/routes";
import FormatSettingsView from "./formatsettingsview";
import BannersView from "./bannersview";
import EventsView from "./eventsview";


export default (props: { slug: string }) => {
    
    let {slug} = props;
    let context = useContext(ModelContext);
    
    let component;
    switch (slug) {
        case FORMAT_SETTINGS_PATH:
            component = <FormatSettingsView {...context} />;
            break;
        case BANNERS_PATH:
            component = <BannersView {...context} />;
            break;
        default:
        case EVENTS_PATH:
            component = <EventsView {...context} />;
            break;
    }

    return (
        <React.StrictMode>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <ModelContextComponent>
                    <CssBaseline />
                    <Header slug={slug} />
                    <Box className="p-2">
                        {component}
                    </Box>
                </ModelContextComponent>
            </LocalizationProvider>
        </React.StrictMode>
    );
}
