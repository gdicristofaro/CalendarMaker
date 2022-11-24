import React from "react";
import { useEffect, useState } from "react";
import { SettingsModel } from "./model";

const KEY = "settings";

// function getInitialState() {
//     const settings = localStorage.getItem(KEY)
//     return settings ? JSON.parse(settings) : undefined;
// }


export interface ModelContextProps {
    settings: undefined | SettingsModel;
    update: (newSettings: SettingsModel) => void
}

export const ModelContext = React.createContext<ModelContextProps>({
    settings: undefined,
    update: (newSettings: SettingsModel) => {}
});


export const SettingsContextComponent = (props: { children: any }) => {
    const [model, setModel] = useState<SettingsModel>(PptxGen.DefaultSettings);

    useEffect(() => {
        localStorage.setItem(KEY, JSON.stringify(model))
    }, [model])

    return (
        <ModelContext.Provider value={{
            settings: model,
            update: setModel
        }}>
            {props.children}
        </ModelContext.Provider>
    );
}


// export const ModelProvider = (props: undefined | SettingsModel) => {
//     const [model, setModel] = useState(getInitialState)

//     useEffect(() => {
//         localStorage.setItem(KEY, JSON.stringify(model))
//     }, [model])
// }

