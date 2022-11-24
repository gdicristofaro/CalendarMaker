import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import MainComponent from "./components/maincomponent";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { SettingsModel } from './model';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const ModelContext = React.createContext<undefined | SettingsModel>(undefined);

root.render(
  <React.StrictMode>
    <ModelContext.Provider value="dark">
      <MainComponent />
    </ModelContext.Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
