import React from "react";
import { useEffect, useState } from "react";
import { DefaultSettings, SettingsModel } from "./model";

const KEY = "settings";


export interface ModelContextProps {
    settings: undefined | SettingsModel;
    update: (newSettings: SettingsModel) => void
}

export const ModelContext = React.createContext<ModelContextProps>({
    settings: undefined,
    update: (newSettings: SettingsModel) => { }
});


export const ModelContextComponent = (props: { children: any }) => {
    const [model, setModel] = useState(() => {
        const saved = localStorage.getItem(KEY);
        const initialValue = saved && JSON.parse(saved);
        return initialValue || DefaultSettings;
    });

    useEffect(() => {
        localStorage.setItem(KEY, JSON.stringify(model))
    }, [model]);

    return (<ModelContext.Provider value={{ settings: model, update: setModel }}>
        {props.children}
    </ModelContext.Provider>)
}
