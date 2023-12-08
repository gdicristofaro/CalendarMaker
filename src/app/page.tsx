"use client"; 

import React from "react";
import MainComponent from "./components/maincomponent";
import { ModelContextComponent } from './model/modelcontext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


export default () => (
  <React.StrictMode>
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <ModelContextComponent>
      <MainComponent />
    </ModelContextComponent>
  </LocalizationProvider>
</React.StrictMode>
);