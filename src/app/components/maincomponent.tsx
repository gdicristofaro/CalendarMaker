"use client";

import React, { useContext } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { usePathname } from "next/navigation";
import { Box, CssBaseline } from "@mui/material";
import Header from "./header";
import { ModelContext, ModelContextComponent } from "../model/modelcontext";
import { FORMAT_SETTINGS_PATH, BANNERS_PATH } from "../model/routes";
import BannersView from "../views/bannersview";
import EventsView from "../views/eventsview";
import FormatSettingsView from "../views/formatsettingsview";


export default (props: {slug: string}) => {
    let context = useContext(ModelContext);
    
    let tabComponent;
    switch (props.slug) {
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
        <React.StrictMode>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <ModelContextComponent>
                    <Box>
                        <CssBaseline />
                        <Header {...{ ...context, ...props }} />
                        <Box className="p-2">
                            {tabComponent}
                        </Box>
                    </Box>
                </ModelContextComponent>
            </LocalizationProvider>
        </React.StrictMode>
    );
}