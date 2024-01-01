import { useContext } from "react";
import ImageLoader from "../components/imageloader";
import { MONTHS, SettingsModel } from "../model/model";
import { ModelContext, ModelContextProps } from "../model/modelcontext";

export default function BannersView(props: ModelContextProps) {
    let { settings, update } = props;

    let bannerComps = MONTHS.map((val, i, arr) => {
        let initialBannerDataUrl: string = settings?.banners[val] || "";
        return (
            <div key={"bannerDiv" + i.toString()} style={{ margin: 20, display: 'inline-block', verticalAlign: 'top' }}>
                <ImageLoader
                    initialDataUrl={initialBannerDataUrl}
                    key={"banneritem" + i.toString()}
                    onDataUrl={(durl) => {
                        let copiedSettings: SettingsModel =  structuredClone(settings);
                        (copiedSettings.banners as any)[val] = durl;
                        update(copiedSettings);
                    }}
                    title={"Choose banner for " + arr[i] + "..."}
                />
            </div>
        );
    });

    return (<>{bannerComps}</>);
}