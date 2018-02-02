// creates dataurl from image upload
import * as React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';

export interface ImageLoaderProps { onDataUrl: (string) => void, initialDataUrl: string, title: string }

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export class ImageLoader extends React.Component<ImageLoaderProps, undefined> {
    handleChange(selectorFiles: FileList)
    {
        if (!selectorFiles || selectorFiles.length <= 0)
            return;
        
        let file = selectorFiles[0];
        let fileType = file.type.toUpperCase().trim();

        if (!fileType.startsWith("IMAGE"))
            return;

        let reader = new FileReader();

        reader.addEventListener("load", () => { this.setState({image: reader.result}); this.props.onDataUrl(reader.result) });
        reader.readAsDataURL(file);
    }


    render() {
        let imgComp = (this.props.initialDataUrl && this.props.initialDataUrl.length > 0) ?
            (<img src={this.props.initialDataUrl} 
                style={{maxWidth: '200px', maxHeight: '200px', display: 'inline-block', margin: '0 auto'}} 
                className="boxshadowed marginv20" 
            />) :
            undefined;

        return (
            <Paper style={{padding: 10, display: 'inline-block'}}>
                <div style={{marginRight: 10, display: 'inline-block'}}>
                    <RaisedButton
                        style={{margin: 5}}
                        containerElement='label'
                        label={this.props.title}>
                        <input type="file" onChange={ (e) => this.handleChange(e.target.files)} style={{display: 'none'}}/>
                    </RaisedButton>
                </div>
                <div style={{ display: 'inline-block'}}>
                    <IconButton
                        iconStyle={{width: 32, height: 32}}
                        style={{ padding: 8}}
                        onClick={() => { this.props.onDataUrl(""); this.setState({image: ""});}}
                    >
                        <ActionDelete />
                    </IconButton>
                </div>
                <Paper style={{margin: 5}}>
                    <div style={{minWidth: 210, minHeight: 210}}>
                        {imgComp}
                    </div>
                </Paper>
            </Paper>);
    }
}