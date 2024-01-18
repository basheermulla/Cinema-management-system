import PropTypes from 'prop-types';
import { forwardRef, useEffect } from 'react';
import { useDispatch } from 'store';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Grid, Stack, TextField, Typography, Button, Dialog, FormControl, FormControlLabel, FormHelperText, IconButton, Radio, RadioGroup,
    Switch, Zoom, DialogContent
} from '@mui/material';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

// internal imports
import MainCard from 'components/cards/MainCard';
import AnimateButton from 'components/extended/AnimateButton';
import Avatar from 'components/extended/Avatar';
import { gridSpacing } from 'utils/constant-theme';

// assets
import Avatar1 from 'assets/images/users/avatar-1.png';
import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';


const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Enter a valid email').required('Email is required'),
    city: yup.string().required('City is required'),
    image: yup.string().required('Image is required'),
});

const Transition = forwardRef((props, ref) => <Zoom ref={ref} {...props} />);

const MemberProfile = ({ member, editMember }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: member.name,
            email: member.email,
            city: member.city,
            image: member.image,
        },
        validationSchema,
        onSubmit: (values, { resetForm }) => {
            editMember(member._id, values);
            navigate(-1);           

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
        <>
            <Grid container spacing={gridSpacing}>

                <MainCard
                    title={<Avatar alt="Member 1" src={member.image} sx={{ height: 60, width: 60 }} />}
                    secondary={
                        <IconButton onClick={() => { formik.resetForm() }} size="large" aria-label="Close Edit Member">
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
                                    label="Image"
                                    value={formik.values.image}
                                    onChange={formik.handleChange}
                                    error={formik.touched.image && Boolean(formik.errors.image)}
                                    helperText={formik.touched.image && formik.errors.image}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                    <Button color="error" onClick={() => { formik.resetForm(), navigate(-1) }}>
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
            </Grid>
        </>
    )
}

MemberProfile.propTypes = {
    member: PropTypes.object,
    editMember: PropTypes.func
}

export default MemberProfile;