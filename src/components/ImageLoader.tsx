// creates dataurl from image upload
import {useState} from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';


// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
const ImageLoader = (props: {
    onDataUrl: (url: string) => void,
    initialDataUrl: string,
    title: string
}) => {

    let [image, setImage] = useState<string>(props.initialDataUrl);

    let handleChange = (selectorFiles: FileList) => {
        if (!selectorFiles || selectorFiles.length <= 0)
            return;
        
        let file = selectorFiles[0];
        let fileType = file.type.toUpperCase().trim();

        if (!fileType.startsWith("IMAGE"))
            return;

        let reader = new FileReader();

        reader.addEventListener("load", () => { setImage(reader.result as string); props.onDataUrl(reader.result as string) });
        reader.readAsDataURL(file);
    }


    let imgComp = (props.initialDataUrl && props.initialDataUrl.length > 0) ?
        (<img src={props.initialDataUrl} 
            style={{maxWidth: '200px', maxHeight: '200px', display: 'inline-block', margin: '0 auto'}} 
            className="boxshadowed marginv20" 
        />) :
        undefined;

    return (
        <Paper style={{padding: 10, display: 'inline-block'}}>
            <div style={{marginRight: 10, display: 'inline-block'}}>
                {/* TODO: what is this? */}
                <Button
                    // style={{margin: 5}}
                    // containerElement='label'
                    // label={this.props.title}
                >
                    <input type="file" onChange={ (e) => handleChange(e.target.files as FileList)} style={{display: 'none'}}/>
                </Button>
            </div>
            <div style={{ display: 'inline-block'}}>
                <IconButton
                    // iconStyle={{width: 32, height: 32}}
                    // style={{ padding: 8}}
                    onClick={() => { props.onDataUrl(""); setImage(""); }}
                >
                    <DeleteIcon />
                </IconButton>
            </div>
            <Paper style={{margin: 5}}>
                <div style={{minWidth: 210, minHeight: 210}}>
                    {imgComp}
                </div>
            </Paper>
        </Paper>
    );
}

export default ImageLoader;