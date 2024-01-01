"use client"; 

import React from "react";
import MainView from "./views/mainview";
import { ModelContextComponent } from './model/modelcontext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


export default () => (
  <React.StrictMode>
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <ModelContextComponent>
      <MainView />
    </ModelContextComponent>
  </LocalizationProvider>
</React.StrictMode>
);