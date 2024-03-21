import { useContext } from "react";
import ImageLoader from "../components/imageloader";
import { MONTHS, SettingsModel } from "../model/model";
import { ModelContext, ModelContextProps } from "../model/modelcontext";
import { Grid } from "@mui/material";

export default function BannersView(props: ModelContextProps) {
    let { settings, update } = props;

    let bannerComps = MONTHS.map((val, i, arr) => {
        let initialBannerDataUrl: string = settings?.banners[val] || "";
        return (
            <Grid item xs={12} sm={6} md={4} lg={3}>
                {/* <div style={{margin: 'auto', display: 'flex', flexDirection: 'column'}}> */}
                <ImageLoader
                    initialDataUrl={initialBannerDataUrl}
                    key={"banneritem" + i.toString()}
                    onDataUrl={(durl) => {
                        let copiedSettings: SettingsModel =  structuredClone(settings);
                        (copiedSettings.banners as any)[val] = durl;
                        update(copiedSettings);
                    }}
                    title={arr[i]}
                />
                {/* </div> */}
            </Grid>
        );
    });

    return (<Grid container spacing={2}>
        {bannerComps}
    </Grid>);
}