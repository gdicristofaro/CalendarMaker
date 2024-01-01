import AllFormatSettings from "../components/settingsitem";
import { SettingsModel } from "../model/model";
import { ModelContextProps } from "../model/modelcontext";

export default function FormatSettingsView(props: ModelContextProps) {
    let {settings, update} = props;

    return (
    <AllFormatSettings model={settings?.formatting} onChange={(newSettings) => {
        let copiedSettings: SettingsModel = structuredClone(settings);
        copiedSettings.formatting = newSettings;
        update(copiedSettings);
    }} />);
}