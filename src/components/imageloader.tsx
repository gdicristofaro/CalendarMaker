// creates dataurl from image upload
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/system';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';


const HoverOverlay = styled('div')({
    position: 'absolute', 
    top: 0, 
    bottom: 0, 
    left: 0, 
    right: 0, 
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0)',
    zIndex: 9999999,
    transition: "background-color 0.5s",
    "&:hover": { 
        backgroundColor: 'rgba(0,0,0,0.5)',
        transition: "background-color 0.5s"
    }
  });

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
const ImageLoader = (props: {
    onDataUrl: (url: string) => void,
    initialDataUrl: string,
    title: string
}) => {
    let handleFileSelected = (selectorFiles: FileList) => {
        if (!selectorFiles || selectorFiles.length <= 0)
            return;

        let file = selectorFiles[0];
        let fileType = file.type.toUpperCase().trim();

        if (!fileType.startsWith("IMAGE"))
            return;

        let reader = new FileReader();

        reader.addEventListener("load", () => { props.onDataUrl(reader.result as string) });
        reader.readAsDataURL(file);
    }

    let hasImg = props.initialDataUrl && props.initialDataUrl.length > 0;
    let displayedComp;
    if (hasImg) {
        displayedComp = (
        <div style={{
            width: '100%', 
            height: '100%', 
            overflow: 'hidden', 
            padding: '7px', 
            boxSizing: 'border-box'
            }}>
            <div style={{
                position: 'relative', 
                height: '100%', 
                width: '100%', 
                boxSizing: 'border-box', 
                borderRadius: '4px', 
                overflow: 'hidden'
                }}>
                <img 
                    src={props.initialDataUrl} 
                    alt="Selected File"
                    style={{ 
                        width: '100%', 
                        height: '100%'
                     }}
                    className="boxshadowed marginv20"
                />
                <HoverOverlay>
                    {/* <div style={{opacity: 1, color: 'white'}}>Test</div> */}
                    <div style={{
                        color: 'white',
                        opacity: 1,
                        maxWidth: '60%',
                        display: 'flex'
                    }}>
                        <IconButton sx={{ flex: 1 }} color="primary">
                            <VisibilityIcon />
                        </IconButton>
                        <IconButton sx={{ flex: 1 }}>
                            <DeleteIcon sx={{color: 'white'}} />
                        </IconButton>
                    </div>    
                </HoverOverlay>
            </div>
        </div>
        )
    } else {
        displayedComp = (
            <Button
            style={{ 
                position: 'absolute', 
                top: 0, 
                bottom: 0, 
                left: 0, 
                right: 0 
            }}
            component='label'
        >
            <div style={{ 
                position: 'relative', 
                textAlign: 'center' 
                }}>
                    <AddIcon style={{ 
                        display: 'block', 
                        width: '70px', 
                        height: '70px' 
                        }} />
                    Add
            </div>

            <input type="file" onChange={(e) => handleFileSelected(e.target.files as FileList)} style={{ display: 'none' }} />
        </Button>
        );
    }

    return (
        // <Paper style={{padding: 10, display: 'inline-block'}}>


        // <div style={{marginRight: 10, display: 'inline-block'}}>
        //     <Button
        //         style={{margin: 5}}
        //         component='label'
        //     >
        //         {props.title}
        //         <input type="file" onChange={ (e) => handleChange(e.target.files as FileList)} style={{display: 'none'}}/>
        //     </Button>
        // </div>
        // <div style={{ display: 'inline-block'}}>
        //     <IconButton
        //         // iconStyle={{width: 32, height: 32}}
        //         style={{ padding: 8}}
        //         onClick={() => { props.onDataUrl(""); }}
        //         disabled={!props.initialDataUrl || props.initialDataUrl.length === 0}
        //     >
        //         <DeleteIcon />
        //     </IconButton>
        // </div>


        <Paper style={{ margin: 5 }}>
            <div style={{ width: '210px', height: '210px', position: 'relative' }}>
                {displayedComp}
            </div>
        </Paper>
        // </Paper>
    );
}

export default ImageLoader;