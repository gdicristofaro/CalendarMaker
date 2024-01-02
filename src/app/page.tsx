"use client";

import React from "react";
import MainView from "./views/mainview";
import { ModelContextComponent } from './model/modelcontext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { usePathname } from "next/navigation";
import { EVENTS_PATH } from "./model/routes";


export default () => {
    let pathname = usePathname()?.toLowerCase()?.replace(/[^a-z]/, "") || EVENTS_PATH;
    
    return (
        <React.StrictMode>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <ModelContextComponent>
                    <MainView slug={pathname || ""} />
                </ModelContextComponent>
            </LocalizationProvider>
        </React.StrictMode>
    );
}