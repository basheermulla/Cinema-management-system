import PropTypes from 'prop-types';
import { forwardRef, useEffect } from 'react';

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
import { useDispatch, useSelector } from 'store';
import { openSnackbar } from "store/slices/snackbar";

// assets
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';

const validationSchema = yup.object({
    memberId: yup.string().required('Member Id is required'),
    movieId: yup.string().required('Movie Id selection is required'),
    date: yup.date().nullable().required('Subscription date is required'),
});

const Transition = forwardRef((props, ref) => <Zoom ref={ref} {...props} />);

const AddSubscriptionByMember = ({ open, movieId, handleCloseSubscribeDialog, addSubscriptionByMember, members }) => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            memberId: '',
            movieId: movieId?.movieId,
            date: '',
        },
        validationSchema,
        onSubmit: (values, { resetForm }) => {
            console.log(values);
            // Add a subscription for the selected member with a given movie
            addSubscriptionByMember('put', { id: values.memberId }, { movieId: values.movieId, date: values.date });
            const memberName = members?.find((member) => member._id === values.memberId).name;

            dispatch(
                openSnackbar({
                    open: true,
                    message: 'Subscription for ' + memberName + ' generated successfully 🙂',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: false
                })
            );

            resetForm();
            handleCloseSubscribeDialog();
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
                    {console.log(formik.values)}
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12} md={6}>
                                <FormControl sx={{ m: 1, minWidth: 120 }}>
                                    <InputLabel id="memberId-select">Members</InputLabel>
                                    <Select
                                        fullWidth
                                        labelId="memberId-select"
                                        id="memberId"
                                        name="memberId"
                                        value={formik.values.memberId}
                                        onChange={formik.handleChange}
                                        label="Member"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {
                                            members?.map((member) => (
                                                <MenuItem key={member._id} value={member._id}>{member.name}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                    {formik.errors.memberId && (
                                        <FormHelperText error id="standard-weight-helper-text-email-login">
                                            {' '}
                                            {formik.errors.memberId}{' '}
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
                                        minDate={new Date()} // Prevents selection of previous dates
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                    <Button color="error" onClick={() => { handleCloseSubscribeDialog(), formik.resetForm() }}>
                                        Cancel
                                    </Button>
                                    <AnimateButton>
                                        <Button variant="contained" type="submit" disabled={formik.isSubmitting}>
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

AddSubscriptionByMember.propTypes = {
    open: PropTypes.bool,
    movieId: PropTypes.object,
    handleCloseSubscribeDialog: PropTypes.func,
    addSubscriptionByMember: PropTypes.func,
    members: PropTypes.array
};

export default AddSubscriptionByMember;