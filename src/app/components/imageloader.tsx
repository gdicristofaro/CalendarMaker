/**
 *   creates dataurl from image upload
 */
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/system';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { Card, CardActionArea, CardActions, CardContent, CardMedia, Dialog, DialogTitle, Typography } from '@mui/material';
import { CSSProperties, useState } from 'react';

const COMPONENT_SIZE = '210px';
const BUTTON_SIZE = '70px';
const PAPER_MARGIN = '5px';

const STYLES: { [key: string]: CSSProperties } = {
    title: {
    },
    mainPaper: {
        display: "inline-block"
    },
    mainContainer: {
        width: COMPONENT_SIZE,
        height: COMPONENT_SIZE,
        position: 'relative'
    },
    addImageButton: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    addImageTextContainer: {
        position: 'relative',
        textAlign: 'center'
    },
    addImageIcon: {
        display: 'block',
        width: BUTTON_SIZE,
        height: BUTTON_SIZE
    },
    imageOverlayContainer: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box'
    },
    imageContainer: {
        position: 'relative',
        height: '100%',
        width: '100%',
        borderRadius: '4px',
    },
    image: {
        maxWidth: '100%',
        maxHeight: '100%',
        transform: 'translate(-50%, -50%)',
        position: 'relative',
        left: '50%',
        top: '50%'
    },
    hoverOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0)',
        zIndex: 1,
        opacity: 0,
        transition: "background-color 0.5s, opacity 0.5s",
        "&:hover": {
            opacity: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            transition: "background-color 0.5s, opacity 0.5s"
        }
    } as any,
    titleDiv: {
        padding: '0px 10px 2px 10px',
        display: 'block',
    },
    imageButtonsContainer: {
        position: 'relative',
        color: 'white',
        opacity: 1,
        minHeight: 0,
        margin: '35% 25%',
        display: 'flex',
        height: '30%',
        width: '50%'
    },
    imageButton: {
        flex: 1,
        color: '#dfdfdf',
        transition: 'color 0.2s',
        "&:hover": {
            color: '#fff',
            transition: 'color 0.2s'
        },
        "&:active": {
            color: '#ccc',
            transition: 'color 0.2s'
        }
    } as any,
    imageButtonIcon: {
        width: '100%',
        height: '100%'
    },
    lightboxContainer: {
        overflow: 'hidden',
        "& div": {
            overflow: 'hidden'
        }
    } as any,
    lightboxImageContainer: {
        width: "100%",
        height: "100%",
        padding: '10px',
        boxSizing: 'border-box',
    },
    lightboxImage: {
        maxWidth: "80vw",
        maxHeight: "70vh",
    }

}

const HoverOverlay = styled('div')(STYLES.hoverOverlay as any);

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
const ImageLoader = (props: {
    onDataUrl: (url: string) => void,
    initialDataUrl: string,
    title?: string,
    lightboxTitle?: string
}) => {
    let [lightboxOpen, setLightboxOpen] = useState(false);

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

    let titleComp = undefined;
    if (props.title) {
        titleComp = (
                <Typography variant="subtitle1" component="div" style={STYLES.titleDiv}>{props.title}</Typography>
        );
    }

    let hasImg = props.initialDataUrl && props.initialDataUrl.length > 0;
    let displayedComp;
    if (hasImg) {
        displayedComp = (
            <div style={STYLES.imageOverlayContainer}>
                <div style={STYLES.imageContainer}>
                    <img
                        src={props.initialDataUrl}
                        alt="Selected File"
                        style={STYLES.image}
                    />
                    <HoverOverlay>
                        <div style={STYLES.imageButtonsContainer}>
                            <Dialog sx={STYLES.lightboxDialog}
                                onClose={() => setLightboxOpen(false)}
                                open={lightboxOpen}>
                                <DialogTitle>{props.lightboxTitle || props.title}</DialogTitle>
                                <div style={STYLES.lightboxImageContainer}>
                                    <img
                                        src={props.initialDataUrl}
                                        alt="Selected File"
                                        style={STYLES.lightboxImage}
                                    />
                                </div>
                            </Dialog>
                            <IconButton sx={STYLES.imageButton}
                                size='small'
                                onClick={() => setLightboxOpen(true)}
                                disableRipple>
                                <VisibilityIcon style={STYLES.imageButtonIcon} />
                            </IconButton>
                            <IconButton sx={STYLES.imageButton}
                                size='small'
                                onClick={() => props.onDataUrl('')}
                                disableRipple>
                                <DeleteIcon style={STYLES.imageButtonIcon} />
                            </IconButton>
                        </div>
                    </HoverOverlay>
                </div>
            </div>
        )
    } else {
        displayedComp = (
            <>
                <Button
                    style={STYLES.addImageButton}
                    component='label'
                >
                    <div style={STYLES.addImageTextContainer}>
                        <AddIcon style={STYLES.addImageIcon} />
                        Add
                    </div>

                    <input
                        type="file"
                        onChange={(e) => handleFileSelected(e.target.files as FileList)}
                        style={{ display: 'none' }}
                    />
                </Button>
            </>
        );
    }


    return (
        <>
        {titleComp}
        <Card style={STYLES.mainPaper}>
            <CardMedia style={STYLES.mainContainer}>
                {displayedComp}
            </CardMedia>
        </Card>
        </>
    );
}

export default ImageLoader;