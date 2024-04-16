import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Button, Dialog, FormControl, FormControlLabel, FormHelperText, IconButton, Grid, Radio, RadioGroup, Stack, Switch, TextField,
    Zoom, DialogContent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// third-party
import { useFormik } from 'formik';
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
    name: yup.string().required('Name is required'),
    email: yup.string().email('Enter a valid email').required('Email is required'),
    city: yup.string().required('City is required'),
    image: yup.string().required('Image is required'),
});

const Transition = forwardRef((props, ref) => <Zoom ref={ref} {...props} />);

const AddOrEditMember = ({ open, member, handleCloseMemberDialog, addMember, editMember }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigete = useNavigate();
    const edit = member && member._id;

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: edit ? member.name : '',
            email: edit ? member.email : '',
            city: edit ? member.city : '',
            image: edit ? member.image : '',
        },
        validationSchema,
        onSubmit: (values, { resetForm }) => {
            if (edit) {
                // console.log('values = ', values);
                editMember(member._id, values);
                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Member of ' + values.name + ' updated successfully 🙂',
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        close: false
                    })
                );
            } else {
                // console.log('values = ', values);
                addMember(values);
                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Member for ' + values.name + ' generated successfully 🙂',
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        close: false
                    })
                );
            }
            resetForm();
            handleCloseMemberDialog();
            // navigete('/cinema/subscriptions');
        }
    });

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => { handleCloseMemberDialog(), formik.resetForm() }}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogContent sx={{ p: 0 }}>
                <MainCard
                    title={edit ? 'Edit Member' : 'Add New Member'}
                    secondary={
                        <IconButton onClick={() => { handleCloseMemberDialog(), formik.resetForm() }} size="large" aria-label="Close Edit Member">
                            <HighlightOffTwoToneIcon fontSize="small" />
                        </IconButton>
                    }
                    sx={{ border: 0 }}
                >
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="name"
                                    name="name"
                                    label="Name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    id="email"
                                    name="email"
                                    label="Email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    id="city"
                                    name="city"
                                    label="City"
                                    value={formik.values.city}
                                    onChange={formik.handleChange}
                                    error={formik.touched.city && Boolean(formik.errors.city)}
                                    helperText={formik.touched.city && formik.errors.city}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="image"
                                    name="image"
                                    label="Image: Insert ===> { https://source.unsplash.com/collection/9948714? } and concat { an integer number }"
                                    value={formik.values.image}
                                    onChange={formik.handleChange}
                                    error={formik.touched.image && Boolean(formik.errors.image)}
                                    helperText={formik.touched.image && formik.errors.image}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                    <Button color="error" onClick={() => { handleCloseMemberDialog(), formik.resetForm() }}>
                                        Cancel
                                    </Button>
                                    <AnimateButton>
                                        <Button variant="contained" type="submit">
                                            Submit
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

AddOrEditMember.propTypes = {
    open: PropTypes.bool,
    member: PropTypes.object,
    handleCloseMemberDialog: PropTypes.func,
    addMember: PropTypes.func,
    editMember: PropTypes.func
};

export default AddOrEditMember;
