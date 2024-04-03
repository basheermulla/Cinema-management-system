// material-ui
import { Alert, Button, Fade, Grow, IconButton, Slide } from '@mui/material';
import MuiSnackbar from '@mui/material/Snackbar';

// assets
import CloseIcon from '@mui/icons-material/Close';

// internal imports
import { useDispatch, useSelector } from 'store';
import { closeSnackbar } from "store/slices/snackbar";

// animation function
function TransitionSlideLeft(props) {
    return <Slide {...props} direction='left' />;
}

function TransitionSlideUp(props) {
    return <Slide {...props} direction='up' />;
}

function TransitionSlideRight(props) {
    return <Slide {...props} direction='right' />;
}

function TransitionSlideDown(props) {
    return <Slide {...props} direction='down' />;
}

function GrowTransition(props) {
    return <Grow {...props} />;
}

// animation options
const animation = {
    SlideLeft: TransitionSlideLeft,
    SlideUp: TransitionSlideUp,
    SlideRight: TransitionSlideRight,
    SlideDown: TransitionSlideDown,
    Grow: GrowTransition,
    Fade
}

// ==============================|| SNACKBAR ||================================//

const Snackbar = () => {
    const dispatch = useDispatch();
    const snackbar = useSelector((state) => state.snackbar);
    const { open, message, anchorOrigin, variant, alert, transition, close, actionButton } = snackbar;

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        dispatch(closeSnackbar());
    };

    return (
        <>
            {/* default snackbar */}
            {variant === 'default' && (
                <MuiSnackbar
                    anchorOrigin={anchorOrigin}
                    open={open}
                    autoHideDuration={1500}
                    onClose={handleClose}
                    message={message}
                    TransitionComponent={animation[transition]}
                    action={
                        <>
                            <Button color='secondary' size='small' onClick={handleClose}>
                                UNDO
                            </Button>
                            <IconButton color='inherit' size='small' aria-label='close' onClick={handleClose} sx={{ mt: 0.25 }}>
                                <CloseIcon fontSize='small' />
                            </IconButton>
                        </>
                    }
                />
            )}

            {/* alert snackbar */}
            {variant === 'alert' && (
                <MuiSnackbar
                    anchorOrigin={anchorOrigin}
                    open={open}
                    autoHideDuration={1500}
                    onClose={handleClose}
                    TransitionComponent={animation[transition]}
                >
                    <Alert
                        variant={alert.variant}
                        color={alert.color}
                        action={
                            <>
                                {actionButton !== false && (
                                    <Button size='small' onClick={handleClose} sx={{ color: 'Background.paper' }}>
                                        UNDO
                                    </Button>
                                )}
                                {close !== false && (
                                    <IconButton size='small' aria-label='close' onClick={handleClose} sx={{ color: 'Background.paper' }}>
                                        <CloseIcon fontSize='small' />
                                    </IconButton>
                                )}
                            </>
                        }
                        sx={{
                            ...(alert.variant === 'outlined' && {
                                bgcolor: 'Background.paper'
                            })
                        }}
                    >
                        {message}
                    </Alert>
                </MuiSnackbar>
            )}
        </>
    );
}

export default Snackbar;