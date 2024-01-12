import { FunctionComponent } from "react";
import { ModelContextProps } from "./modelcontext";
import FormatSettingsView from "../views/formatsettingsview";
import EventsView from "../views/eventsview";
import BannersView from "../views/bannersview";

export const FORMAT_SETTINGS_PATH = "formatting";
export const EVENTS_PATH = "events";
export const BANNERS_PATH = "banners";
// export const ROUTES: {pathname: string, component: FunctionComponent<ModelContextProps> }[] = [ 
//     { pathname: FORMAT_SETTINGS_PATH, component: FormatSettingsView },
//     { pathname: EVENTS_PATH, component: EventsView },
//     { pathname: BANNERS_PATH, component: BannersView }
// ];

// export const ROUTE_PATHS = ROUTES.map(r => r.pathname);

export const ROUTE_PATHS = [FORMAT_SETTINGS_PATH, EVENTS_PATH, BANNERS_PATH]
export const DEFAULT_PATH = EVENTS_PATH;