import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { useState } from "react";


export default function ResetButton(props: { reset: () => void}) {
    let [showReset, setShowReset] = useState(false);
    let { reset } = props;

    return (
        <>
            <Button
                className="grow-0 flex-none"
                variant='outlined'
                style={{ margin: 10 }}
                onClick={() => setShowReset(true)}
            >
                Clear All Settings
            </Button>

            <Dialog
                open={showReset}
                onClose={() => setShowReset(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Reset All Settings?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to reset all settings?  This will delete all current events as well.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant='outlined' onClick={() => setShowReset(false)}>Cancel</Button>
                    <Button variant='outlined'
                        onClick={() => {
                            reset();
                            setShowReset(false);
                        }}
                        autoFocus
                    >
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}