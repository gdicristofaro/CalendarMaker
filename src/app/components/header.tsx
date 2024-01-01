import { Button, TextField } from "@mui/material";
import download from "downloadjs";
import { SettingsModel } from "../model/model";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ArticleIcon from '@mui/icons-material/Article';
import { ModelContextProps } from "../model/modelcontext";
import settingsLoad from "../actions/settingsload";
import generatePptxFromSettings from "../actions/pptxgen";

export default function Header(props: ModelContextProps) {
    let {settings, update} = props;

    return (
        <div className="grow-0 flex-none">
            <Button
                variant='outlined'
                component='label'
                startIcon={<FileUploadIcon />}
                style={{ margin: 10 }}
            >
                Load Settings
                <input type="file" onChange={(e) => settingsLoad(update, e.target.files)} style={{ display: 'none' }} />
            </Button>
            <Button
                variant='outlined'
                component='label'
                startIcon={<FileDownloadIcon />}
                style={{ margin: 10 }}
                onClick={(e) => download(JSON.stringify(settings), "settings.json", "application/json")}
            >
                Save Settings
            </Button>
            <Button
                variant="outlined"
                style={{ margin: 10 }}
                startIcon={<ArticleIcon />}
                onClick={() => generatePptxFromSettings(settings)}
            >
                Create PowerPoint File
            </Button>
            <TextField
                size='small'
                variant='outlined'
                title="Year for Calendar"
                label="Year for Calendar"
                type="number"
                onChange={(e) => {
                    let copiedSettings: SettingsModel = structuredClone(settings);
                    copiedSettings.year = parseInt(e.target.value, 10);
                    update(copiedSettings);
                }}
                value={(settings?.year) ? settings.year : new Date().getFullYear() + 1}
                style={{ paddingLeft: '10px' }}
            />
        </div>
    );
}