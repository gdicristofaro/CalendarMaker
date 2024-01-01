import { DefaultSettings, SettingsModel } from "../model/model";

export default function settingsLoad(
    updateFunct: (settingsModel: SettingsModel) => void, 
    selectorFiles: FileList | null | undefined
) {

    if (!selectorFiles || selectorFiles.length <= 0)
        return;

    let file = selectorFiles[0];

    let reader = new FileReader();

    reader.addEventListener("load",
        () => {
            if (reader.result) {
                let extended = { ...DefaultSettings, ...JSON.parse(reader.result as string) };
                updateFunct(extended);
            }
        }
    );
    reader.readAsText(file);
};