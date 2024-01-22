import PropTypes from 'prop-types';
import { forwardRef, useEffect } from 'react';
import { useDispatch } from 'store';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Button, Dialog, FormControl, FormControlLabel, FormHelperText, InputLabel, Select, MenuItem, IconButton, Grid, Radio, RadioGroup, Stack, Switch,
    TextField, Zoom, DialogContent
} from '@mui/material';

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import { useFormik } from 'formik';
import { parseISO } from 'date-fns'
import * as yup from 'yup';

// internal imports
import MainCard from 'components/cards/MainCard';
import AnimateButton from 'components/extended/AnimateButton';
import { gridSpacing } from 'utils/constant-theme';

// assets
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';

const validationSchema = yup.object({
    memberId: yup.string().required('Member Id is required'),
    subscriptionId: yup.string(),
    movieId: yup.string().required('Movie Id selection is required'),
    date: yup.date().nullable().required('Subscription date is required'),
});

const Transition = forwardRef((props, ref) => <Zoom ref={ref} {...props} />);

const AddSubscription = ({ open, member, subscription, handleCloseSubscribeDialog, addSubscription, editSubscription, movies }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const edit = subscription && subscription.subscriptionId;

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            memberId: member._id,
            subscriptionId: edit ? subscription.subscriptionId : '',
            movieId: edit ? subscription.movie._id : '',
            date: edit ? subscription.date : '',
        },
        validationSchema,
        onSubmit: (values, { resetForm }) => {
            if (edit) {
                // Update future subscription for this member 
                editSubscription({ id: values.memberId }, { subscriptionId: values.subscriptionId, movieId: values.movieId, date: values.date });
            } else if (member.relatedMovie[0].date !== undefined) {
                // Add another subscription for this member
                addSubscription('put', { id: values.memberId }, { movieId: values.movieId, date: values.date });
            } else {
                // Make the first subscription for this member 
                addSubscription('post', { id: values.memberId }, { subscriptionMovies: [{ movieId: values.movieId, date: values.date }] });
            }

            resetForm();
            handleCloseSubscribeDialog();

            /************************************************************************************************
            *                                                                                              *
            *      todo -----> dispatch(openSnackbar({message: 'Submit Success'})                          *
            *                                                                                              *
            *//********************************************************************************************/

            // dispatch(
            //     openSnackbar({
            //         open: true,
            //         message: 'Submit Success',
            //         variant: 'alert',
            //         alert: {
            //             color: 'success'
            //         },
            //         close: false
            //     })
            // );
        }
    });

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => { handleCloseSubscribeDialog(), formik.resetForm() }}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogContent sx={{ p: 0 }}>
                <MainCard
                    title={'Add Subscription Movie'}
                    secondary={
                        <IconButton onClick={() => { handleCloseSubscribeDialog(), formik.resetForm() }} size="large" aria-label="Close Edit Member">
                            <HighlightOffTwoToneIcon fontSize="small" />
                        </IconButton>
                    }
                    sx={{ border: 0 }}
                >
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12} md={6}>
                                <FormControl sx={{ m: 1, minWidth: 120 }}>
                                    <InputLabel id="movieId-select">Movie</InputLabel>
                                    <Select
                                        fullWidth
                                        labelId="movieId-select"
                                        id="movieId"
                                        name="movieId"
                                        value={formik.values.movieId}
                                        onChange={formik.handleChange}
                                        label="Movie"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {
                                            movies.map((movie) => (
                                                <MenuItem key={movie._id} value={movie._id}>{movie.name}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                    {formik.errors.movieId && (
                                        <FormHelperText error id="standard-weight-helper-text-email-login">
                                            {' '}
                                            {formik.errors.movieId}{' '}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                {/* Material Ui Date Picker */}
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        fullWidth
                                        id="date"
                                        name="date"
                                        label="Subscribe date picker"
                                        inputVariant="outlined"
                                        format="MM/dd/yyyy"
                                        value={parseISO(formik.values.date, "yyyy-M-dd'T'HH:mm:ss.SSSX", new Date())}
                                        onChange={value => formik.setFieldValue("date", value)}
                                        slotProps={{ textField: { variant: 'outlined' } }}

                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                    <Button color="error" onClick={() => { handleCloseSubscribeDialog(), formik.resetForm() }}>
                                        Cancel
                                    </Button>
                                    <AnimateButton>
                                        <Button variant="contained" type="submit">
                                            Subscribe
                                        </Button>
                                    </AnimateButton>
                                </Stack>
                            </Grid>
                        </Grid>
                    </form>
                </MainCard>
            </DialogContent>
        </Dialog>
    );
};

AddSubscription.propTypes = {
    open: PropTypes.bool,
    member: PropTypes.object,
    subscription: PropTypes.object,
    handleCloseSubscribeDialog: PropTypes.func,
    addSubscription: PropTypes.func,
    movies: PropTypes.array
};

export default AddSubscription;