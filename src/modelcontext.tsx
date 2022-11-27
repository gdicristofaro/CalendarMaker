import React from "react";
import { useEffect, useState } from "react";
import { SettingsModel } from "./model";

const KEY = "settings";


export interface ModelContextProps {
    settings: undefined | SettingsModel;
    update: (newSettings: SettingsModel) => void
}

export const ModelContext = React.createContext<ModelContextProps>({
    settings: undefined,
    update: (newSettings: SettingsModel) => {}
});


export const ModelContextComponent = (props: { children: any, initialSettings: SettingsModel }) => {
    const [model, setModel] = useState<SettingsModel>(props.initialSettings);

    useEffect(() => {
        localStorage.setItem(KEY, JSON.stringify(model))
    }, [model]);

    return (<ModelContext.Provider value={{settings: model, update: setModel }}>
        {props.children}
    </ModelContext.Provider>)
}
