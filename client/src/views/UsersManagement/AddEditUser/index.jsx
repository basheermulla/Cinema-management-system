import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, FormControlLabel, FormHelperText, IconButton, Grid, Stack, TextField, Typography, Checkbox } from '@mui/material';
// third-party
import { useFormik, getIn } from 'formik';
import * as yup from 'yup';
// internal imports
import MainCard from 'components/cards/MainCard';
import AnimateButton from 'components/extended/AnimateButton';
import { gridSpacing } from 'utils/constant-theme';
import { getDesireUserById, createUser, updateUser } from 'store/slices/user';
import { useDispatch } from 'store';
import { openSnackbar } from "store/slices/snackbar";
// assets
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';

const validationSchema = yup.object({
    username: yup.string().email('Username must be in email format').max(255).required('Username is required'),
    user: yup.object({
        firstName: yup.string().max(255).required('First Name is required'),
        lastName: yup.string().max(255).required('Last Name required'),
        image: yup.string().required('Image is required'),
        sessionTimeOut: yup.number().required("Session time out is required in the unit of minutes"),
        published: yup.date().nullable().required('Published date is required'),
    }),
    permissionsUser: yup.object({
        view_Subscriptions: yup.object().when(['create_Subscriptions', 'update_Subscriptions', 'delete_Subscriptions'], {
            is: (create_Subscriptions, update_Subscriptions, delete_Subscriptions) => {
                if (create_Subscriptions === true || update_Subscriptions === true || delete_Subscriptions === true) {
                    return true;
                } else {
                    return false;
                }
            },
            then: () => yup.boolean().oneOf([true], 'You must apply View Subscribers permissions'),
            otherwise: () => yup.boolean()
        }),
        create_Subscriptions: yup.boolean(),
        update_Subscriptions: yup.boolean(),
        delete_Subscriptions: yup.boolean(),
        view_Movies: yup.object().when(['create_Movies', 'update_Movies', 'delete_Movies'], {
            is: (create_Movies, update_Movies, delete_Movies) => {
                if (create_Movies === true || update_Movies === true || delete_Movies === true) {
                    return true;
                } else {
                    return false;
                }
            },
            then: () => yup.boolean().oneOf([true], 'You must apply View Movies permissions'),
            otherwise: () => yup.boolean()
        }),
        create_Movies: yup.boolean(),
        update_Movies: yup.boolean(),
        delete_Movies: yup.boolean()
    })
});

const AddEditUser = () => {
    const theme = useTheme();
    const { id } = useParams();
    const [userEdit, setUserEdit] = useState(null);
    useEffect(() => {
        if (id) {
            (async () => {
                await getDesireUserById(id).then((response) => {
                    setUserEdit(response);
                });
            })();
        }
    }, [id]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const edit = userEdit && userEdit._id;
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            username: edit ? userEdit.username : '',
            user: {
                firstName: edit ? userEdit.user.firstName : '',
                lastName: edit ? userEdit.user.lastName : '',
                image: edit ? userEdit.user.image : '',
                sessionTimeOut: edit ? userEdit.user.sessionTimeOut : '',
                published: edit ? new Date(userEdit.user.published).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
            },
            permissionsUser: {
                view_Subscriptions: edit ? userEdit.permissionsUser.permissionsUser.find(per => per.view_Subscriptions)?.view_Subscriptions ? true : false : false,
                create_Subscriptions: edit ? userEdit.permissionsUser.permissionsUser.find(per => per.create_Subscriptions)?.create_Subscriptions ? true : false : false,
                update_Subscriptions: edit ? userEdit.permissionsUser.permissionsUser.find(per => per.update_Subscriptions)?.update_Subscriptions ? true : false : false,
                delete_Subscriptions: edit ? userEdit.permissionsUser.permissionsUser.find(per => per.delete_Subscriptions)?.delete_Subscriptions ? true : false : false,
                view_Movies: edit ? userEdit.permissionsUser.permissionsUser.find(per => per.view_Movies)?.view_Movies ? true : false : false,
                create_Movies: edit ? userEdit.permissionsUser.permissionsUser.find(per => per.create_Movies)?.create_Movies ? true : false : false,
                update_Movies: edit ? userEdit.permissionsUser.permissionsUser.find(per => per.update_Movies)?.update_Movies ? true : false : false,
                delete_Movies: edit ? userEdit.permissionsUser.permissionsUser.find(per => per.delete_Movies)?.delete_Movies ? true : false : false
            }
        },
        validationSchema,
        onSubmit: (values, { resetForm }) => {
            // Generate array of permissions that required for create/update user
            const data = values.permissionsUser
            const permissionsUser = { permissionsUser: Object.keys(data).map((key) => { return { [key]: data[key] } }) };
            if (edit) {
                // Update existing user
                const obj_user = {
                    username: values.username,
                    user: { id: userEdit._id, ...values.user, published: new Date(values.user.published) },
                    permissionsUser: { id: userEdit._id, ...permissionsUser }
                }
                dispatch(updateUser({ _id: userEdit._id }, obj_user));
                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'User of ' + values.user.firstName + ' ' + values.user.lastName + ' updated successfully 🙂',
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        close: false
                    })
                );
            } else {
                // Generate new user
                const obj_user = {
                    username: values.username,
                    user: { ...values.user, published: new Date(values.user.published) },
                    permissionsUser
                }
                dispatch(createUser(obj_user));
                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'User for ' + values.user.firstName + ' ' + values.user.lastName + ' generated successfully 🙂',
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        close: false
                    })
                );
            }
            navigate('/management/users')
            resetForm();
        }
    });

    return (
        <MainCard
            title={edit ? 'Edit User' : 'Add New User'}
            secondary={
                <IconButton onClick={() => { formik.resetForm(), navigate('/management/users') }} size="large" aria-label="Close Edit Member" >
                    <HighlightOffTwoToneIcon fontSize="small" />
                </IconButton >
            }
            sx={{ border: 0 }}
        >
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            id="username"
                            name="username"
                            label="Username"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            error={formik.touched.username && Boolean(formik.errors.username)}
                            helperText={formik.touched.username && formik.errors.username}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            id="firstName"
                            name="user.firstName"
                            label="First Name"
                            value={formik.values['user'].firstName}
                            onChange={formik.handleChange}
                            error={Boolean(
                                getIn(formik.touched, 'user.firstName') &&
                                getIn(formik.errors, 'user.firstName')
                            )}
                            helperText={
                                getIn(formik.touched, 'user.firstName') &&
                                getIn(formik.errors, 'user.firstName')
                            }
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            id="lastName"
                            name="user.lastName"
                            label="Last Name"
                            value={formik.values['user'].lastName}
                            onChange={formik.handleChange}
                            error={Boolean(
                                getIn(formik.touched, 'user.lastName') &&
                                getIn(formik.errors, 'user.lastName')
                            )}
                            helperText={
                                getIn(formik.touched, 'user.lastName') &&
                                getIn(formik.errors, 'user.lastName')
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            id="image"
                            name="user.image"
                            label="Image"
                            value={formik.values['user'].image}
                            onChange={formik.handleChange}
                            error={Boolean(
                                getIn(formik.touched, 'user.image') &&
                                getIn(formik.errors, 'user.image')
                            )}
                            helperText={
                                getIn(formik.touched, 'user.image') &&
                                getIn(formik.errors, 'user.image')
                            }
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            id="sessionTimeOut"
                            name="user.sessionTimeOut"
                            label="Session Time Out"
                            value={formik.values['user'].sessionTimeOut}
                            onChange={formik.handleChange}
                            error={Boolean(
                                getIn(formik.touched, 'user.sessionTimeOut') &&
                                getIn(formik.errors, 'user.sessionTimeOut')
                            )}
                            helperText={
                                getIn(formik.touched, 'user.sessionTimeOut') &&
                                getIn(formik.errors, 'user.sessionTimeOut')
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ display: { xs: 'block', sm: 'flex' }, mt: 1.5 }}>
                            <Typography variant="caption">Subscriptions Permissions:</Typography>

                            <Grid container spacing={2}>
                                <Grid item>
                                    <FormControlLabel
                                        control={<Checkbox
                                            checked={formik.values.permissionsUser?.view_Subscriptions ?? false}
                                            name="permissionsUser.view_Subscriptions"
                                            color="primary"
                                            sx={{ color: theme.palette.success.main }}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    formik.setFieldValue(
                                                        'permissionsUser.view_Subscriptions',
                                                        !formik.values.permissionsUser['view_Subscriptions'],
                                                    )
                                                } else {
                                                    formik.setFieldValue(
                                                        'permissionsUser.view_Subscriptions',
                                                        false,
                                                    )
                                                }
                                            }
                                            }
                                        />}
                                        label="View"
                                    />
                                </Grid>
                                <Grid item>
                                    <FormControlLabel
                                        control={<Checkbox
                                            checked={formik.values.permissionsUser?.create_Subscriptions ?? false}
                                            name="permissionsUser.create_Subscriptions"
                                            color="primary"
                                            sx={{ color: theme.palette.warning.main }}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    formik.setFieldValue(
                                                        'permissionsUser.create_Subscriptions',
                                                        !formik.values.permissionsUser['create_Subscriptions'],
                                                    )
                                                } else {
                                                    formik.setFieldValue(
                                                        'permissionsUser.create_Subscriptions',
                                                        false,
                                                    )
                                                }
                                            }
                                            }
                                        />}
                                        label="Create"
                                    />
                                </Grid>
                                <Grid item>
                                    <FormControlLabel
                                        control={<Checkbox
                                            checked={formik.values.permissionsUser?.update_Subscriptions ?? false}
                                            name="permissionsUser.update_Subscriptions"
                                            color="primary"
                                            sx={{ color: theme.palette.secondary.main }}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    formik.setFieldValue(
                                                        'permissionsUser.update_Subscriptions',
                                                        !formik.values.permissionsUser['update_Subscriptions'],
                                                    )
                                                } else {
                                                    formik.setFieldValue(
                                                        'permissionsUser.update_Subscriptions',
                                                        false,
                                                    )
                                                }
                                            }
                                            }
                                        />}
                                        label="Update"
                                    />
                                </Grid>
                                <Grid item>
                                    <FormControlLabel
                                        control={<Checkbox
                                            checked={formik.values.permissionsUser?.delete_Subscriptions ?? false}
                                            name="permissionsUser.delete_Subscriptions"
                                            color="primary"
                                            sx={{ color: theme.palette.orange.main }}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    formik.setFieldValue(
                                                        'permissionsUser.delete_Subscriptions',
                                                        !formik.values.permissionsUser['delete_Subscriptions'],
                                                    )
                                                } else {
                                                    formik.setFieldValue(
                                                        'permissionsUser.delete_Subscriptions',
                                                        false,
                                                    )
                                                }
                                            }
                                            }
                                        />}
                                        label="Delete"
                                    />
                                </Grid>
                            </Grid>
                            <Typography variant="caption">Movies Permissions:</Typography>
                            <Grid container spacing={2}>
                                <Grid item>
                                    <FormControlLabel
                                        control={<Checkbox
                                            checked={formik.values.permissionsUser?.view_Movies ?? false}
                                            name="permissionsUser.view_Movies"
                                            color="primary"
                                            sx={{ color: theme.palette.success.main }}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    formik.setFieldValue(
                                                        'permissionsUser.view_Movies',
                                                        !formik.values.permissionsUser['view_Movies'],
                                                    )
                                                } else {
                                                    formik.setFieldValue(
                                                        'permissionsUser.view_Movies',
                                                        false,
                                                    )
                                                }
                                            }
                                            }
                                        />}
                                        label="View"
                                    />
                                </Grid>
                                <Grid item>
                                    <FormControlLabel
                                        control={<Checkbox
                                            checked={formik.values.permissionsUser?.create_Movies ?? false}
                                            name="permissionsUser.create_Movies"
                                            color="primary"
                                            sx={{ color: theme.palette.warning.main }}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    formik.setFieldValue(
                                                        'permissionsUser.create_Movies',
                                                        !formik.values.permissionsUser['create_Movies'],
                                                    )
                                                } else {
                                                    formik.setFieldValue(
                                                        'permissionsUser.create_Movies',
                                                        false,
                                                    )
                                                }
                                            }
                                            }
                                        />}
                                        label="Create"
                                    />
                                </Grid>
                                <Grid item>
                                    <FormControlLabel
                                        control={<Checkbox
                                            checked={formik.values.permissionsUser?.update_Movies ?? false}
                                            name="permissionsUser.update_Movies"
                                            color="primary"
                                            sx={{ color: theme.palette.secondary.main }}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    formik.setFieldValue(
                                                        'permissionsUser.update_Movies',
                                                        !formik.values.permissionsUser['update_Movies'],
                                                    )
                                                } else {
                                                    formik.setFieldValue(
                                                        'permissionsUser.update_Movies',
                                                        false,
                                                    )
                                                }
                                            }
                                            }
                                        />}
                                        label="Update"
                                    />
                                </Grid>
                                <Grid item>
                                    <FormControlLabel
                                        control={<Checkbox
                                            checked={formik.values.permissionsUser?.delete_Movies ?? false}
                                            name="permissionsUser.delete_Movies"
                                            color="primary"
                                            sx={{ color: theme.palette.orange.main }}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    formik.setFieldValue(
                                                        'permissionsUser.delete_Movies',
                                                        !formik.values.permissionsUser['delete_Movies'],
                                                    )
                                                } else {
                                                    formik.setFieldValue(
                                                        'permissionsUser.delete_Movies',
                                                        false,
                                                    )
                                                }
                                            }
                                            }
                                        />}
                                        label="Delete"
                                    />
                                </Grid>
                            </Grid>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ display: { xs: 'block', sm: 'flex' }, mt: 1.5 }}>
                            {formik.errors.permissionsUser?.view_Subscriptions && (
                                <FormHelperText error name="permissionsUser.view_Subscriptions">
                                    {formik.errors.permissionsUser['view_Subscriptions']}{' '}
                                    {' ! '}
                                </FormHelperText>
                            )}
                            {formik.errors.permissionsUser?.view_Movies && (
                                <FormHelperText error name="permissionsUser.view_Movies">
                                    {formik.errors.permissionsUser['view_Movies']}{' '}
                                </FormHelperText>
                            )}
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Button color="error" onClick={() => { formik.resetForm(), navigate('/management/users') }}>
                                Cancel
                            </Button>
                            <AnimateButton>
                                <Button variant="contained" type="submit">
                                    {edit ? 'Save' : 'Add'}
                                </Button>
                            </AnimateButton>
                        </Stack>
                    </Grid>
                </Grid>
            </form >
        </MainCard >
    );
};

export default AddEditUser;