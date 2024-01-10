import React, { createContext } from "react";
import { useEffect, useState } from "react";
import { DefaultSettings, SettingsModel } from "./model";

const KEY = "settings";


export interface ModelContextProps {
    settings: SettingsModel;
    update: (newSettings: SettingsModel) => void
}

export const ModelContext = createContext<ModelContextProps>({
    settings: DefaultSettings,
    update: (newSettings: SettingsModel) => { }
});


export const ModelContextComponent = (props: { children: any }) => {
    const [model, setModel] = useState(() => {
        if(typeof window !== 'undefined') {
            const saved = window.localStorage.getItem(KEY);
            const initialValue = saved && JSON.parse(saved);
            return initialValue || DefaultSettings;
        }
    });

    useEffect(() => {
        if(typeof window !== 'undefined') {
            window.localStorage.setItem(KEY, JSON.stringify(model))
        }
    }, [model]);

    return (<ModelContext.Provider value={{ settings: model, update: setModel}}>
        {props.children}
    </ModelContext.Provider>)
}
