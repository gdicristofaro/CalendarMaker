import * as React from "react";
import * as ReactDOM from "react-dom";
//import * as injectTapEventPlugin from 'react-tap-event-plugin';

import {ColorPicker, ColorPickerProps} from "./components/ColorPicker";
import {ImageLoader, ImageLoaderProps} from "./components/ImageLoader";
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {MuiThemeProvider, lightBaseTheme} from "material-ui/styles";
import { MainComponent } from "./components/MainComponent";

//injectTapEventPlugin();
const lightMuiTheme = getMuiTheme(lightBaseTheme);

ReactDOM.render(
    <MuiThemeProvider muiTheme={lightMuiTheme}>
        <MainComponent/>
    </MuiThemeProvider>,
    document.getElementById("ui")
);