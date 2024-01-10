import { Button } from "@mui/material";
import DateEvent from "../components/dateevent";
import { SettingsModel, DateEventModel } from "../model/model";
import { ModelContextProps } from "../model/modelcontext";


export default function EventsView(props: ModelContextProps) {
    let { settings, update } = props;

    let dateComps = settings?.events.map((val, i) => {
        return (
            <DateEvent
                id={"event_" + i}
                model={val}
                key={"datecomp" + i.toString()}
                onUpdate={(updateEvt) => {
                    let copiedSettings: SettingsModel = structuredClone(settings);
                    copiedSettings.events[i] = updateEvt;
                    update(copiedSettings);
                }}
                onDelete={() => {
                    let copiedSettings: SettingsModel = structuredClone(settings);
                    copiedSettings.events.splice(i, 1);
                    update(copiedSettings);
                }}
            />
        );
    });

    return (
        <>
            {dateComps}
            <div style={{ padding: '5px' }}>
                <Button
                    variant='outlined'
                    onClick={(e) => {
                        let dateEvtModel: DateEventModel = {
                            dateInfo: {
                                dateType: 'Date',
                                month: 1,
                                dayNum: 1
                            },
                            eventName: "Event Name",
                            imageDataUrl: undefined
                        }

                        let copiedSettings: SettingsModel = structuredClone(settings);
                        copiedSettings.events.push(dateEvtModel);
                        console.log("updating to", copiedSettings)
                        update(copiedSettings);
                    }}
                >
                    Add New Event
                </Button>
            </div>
        </>
    );
}
