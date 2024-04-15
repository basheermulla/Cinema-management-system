import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// material-ui
import {
    Button, Dialog, FormControl, FormControlLabel, FormHelperText, IconButton, Grid, Radio, RadioGroup, Stack, Switch,
    TextField, Zoom, DialogContent, Typography, Chip, InputLabel, Select, MenuItem, Box
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Close from '@mui/icons-material/Close';

// third-party
import { useFormik, getIn } from 'formik';
import { parseISO } from 'date-fns'
import * as yup from 'yup';

// internal imports
import MainCard from 'components/cards/MainCard';
import AnimateButton from 'components/extended/AnimateButton';
import { gridSpacing } from 'utils/constant-theme';
import { typeOptions, genresOptions } from '../MovieDetails/DataOptions';
import { useDispatch, useSelector } from 'store';
import { openSnackbar } from "store/slices/snackbar";

// assets
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';

const filterGenres = createFilterOptions();

const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    image: yup.object({
        medium: yup.string().required('Medium image is required'),
        original: yup.string().required('Original image is required')
    }),
    genres: yup.array()
        .of(
            yup
                .string()
                .trim()
                .required('Leading spaces found in your tag')
                .matches(/^[a-z\d\-/#.&_\s]+$/i, 'Only alphanumerics are allowed')
                .max(50, 'Genres tag field must be at most 50 characters')
        )
        .required('Genres selection is required')
        .min(1, 'Genres tags field must have at least 1 items')
        .max(6, 'Please select a maximum of 6 skills.'),
    type: yup.string().required('Type selection is required'),
    language: yup.string().required('Language selection is required'),
    premiered: yup.date().nullable().required('Premiered date is required'),
    summary: yup.string().required('Summary is required'),
    rating: yup.number().min(1).max(10).required('Please rate this movie.')
});

const Transition = forwardRef((props, ref) => <Zoom ref={ref} {...props} />);

const AddMovie = ({ open, handleCloseDialog, addMovie }) => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            name: '',
            image: {
                medium: '',
                original: ''
            },
            genres: [],
            type: '',
            language: '',
            premiered: new Date(),
            summary: '',
            rating: 0
        },
        validationSchema,
        onSubmit: (values) => {
            addMovie(values);

            dispatch(
                openSnackbar({
                    open: true,
                    message: 'The movie ' + values.name + ' generated successfully 🙂',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: false
                })
            );

            handleCloseDialog();
        }
    });

    let TagsError = false;
    if (formik.touched.genres && formik.errors.genres) {
        if (formik.touched.genres && typeof formik.errors.genres === 'string') {
            TagsError = formik.errors.genres;
        } else if (formik.errors.genres && typeof formik.errors.genres !== 'string') {
            formik.errors.genres.map((item) => {
                if (typeof item === 'object') TagsError = item.label;
                return item;
            });
        }
    }

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogContent sx={{ p: 0 }}>
                <MainCard
                    title={'Add New Movie'}
                    secondary={
                        <IconButton onClick={handleCloseDialog} size="large" aria-label="Close New Movie">
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
                                    label="Movie Name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="image-medium"
                                    name="image.medium"
                                    label="Medium Image"
                                    value={formik.values['image'].medium}
                                    onChange={formik.handleChange}
                                    error={Boolean(
                                        getIn(formik.touched, 'image.medium') &&
                                        getIn(formik.errors, 'image.medium')
                                    )}
                                    helperText={
                                        getIn(formik.touched, 'image.medium') &&
                                        getIn(formik.errors, 'image.medium')
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={1} sx={{ textAlign: 'left' }}>
                                    <Grid item xs={8}>
                                        <TextField
                                            fullWidth
                                            id="image-original"
                                            name="image.original"
                                            label="Original Image"
                                            value={formik.values['image'].original}
                                            onChange={formik.handleChange}
                                            error={Boolean(
                                                getIn(formik.touched, 'image.original') &&
                                                getIn(formik.errors, 'image.original')
                                            )}
                                            helperText={
                                                getIn(formik.touched, 'image.original') &&
                                                getIn(formik.errors, 'image.original')
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            fullWidth
                                            id="rating"
                                            name="rating"
                                            label="Movie rating"
                                            value={formik.values.rating}
                                            onChange={formik.handleChange}
                                            error={formik.touched.rating && Boolean(formik.errors.rating)}
                                            helperText={formik.touched.rating && formik.errors.rating}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    id="genres"
                                    multiple
                                    fullWidth
                                    autoHighlight
                                    freeSolo
                                    disableCloseOnSelect
                                    options={genresOptions}
                                    value={formik.values.genres}
                                    onBlur={formik.handleBlur}
                                    getOptionLabel={(option) => option}
                                    onChange={(event, newValue) => {
                                        const jobExist = genresOptions.includes(newValue[newValue.length - 1]);
                                        if (!jobExist) {
                                            formik.setFieldValue('genres', newValue);
                                        } else {
                                            formik.setFieldValue('genres', newValue);
                                        }
                                    }}
                                    filterOptions={(options, params) => {
                                        const filtered = filterGenres(options, params);
                                        const { inputValue } = params;
                                        const isExisting = options.some((option) => inputValue === option);
                                        if (inputValue !== '' && !isExisting) {
                                            filtered.push(inputValue);
                                        }

                                        return filtered;
                                    }}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props}>
                                            {!genresOptions.some((v) => option.includes(v)) ? `Add "${option}"` : option}
                                        </Box>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            name="genres"
                                            placeholder="Choose movie's genres"
                                            error={formik.touched.genres && Boolean(formik.errors.genres)}
                                            helperText={TagsError}
                                        />
                                    )}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => {
                                            let error = false;
                                            if (formik.touched.genres && formik.errors.genres && typeof formik.errors.genres !== 'string') {
                                                if (typeof formik.errors.genres[index] === 'object') error = true;
                                            }

                                            return (
                                                <Chip
                                                    key={index}
                                                    {...getTagProps({ index })}
                                                    color={error ? 'error' : 'secondary'}
                                                    label={
                                                        <Typography variant="caption" color="secondary.dark">
                                                            {option}
                                                        </Typography>
                                                    }
                                                    deleteIcon={<Close />}
                                                    size="small"
                                                />
                                            );
                                        })
                                    }
                                />
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ display: { xs: 'block', sm: 'flex' }, mt: 1.5 }}>
                                    <Typography variant="caption">Suggestion:</Typography>
                                    <Grid container sx={{ textAlign: 'left' }}>
                                        {genresOptions
                                            .filter((skill) => formik.values.genres && !formik.values.genres.map((item) => item).includes(skill))
                                            .map((option, index) => (
                                                <Grid item key={index} xs={6} sm={3} md={2} lg={2}>
                                                    <Chip
                                                        sx={{ mb: { xs: '4px !important', sm: 0 } }}
                                                        variant="outlined"
                                                        onClick={() => formik.setFieldValue('genres', [...formik.values.genres, option])}
                                                        label={
                                                            <Typography variant="caption" color="text.dark">
                                                                {option}
                                                            </Typography>
                                                        }
                                                        size="small"
                                                    />
                                                </Grid>
                                            ))}
                                    </Grid>
                                </Stack>
                            </Grid>
                            <Grid container spacing={2} sx={{ textAlign: 'left', mt: 0, p: 1 }}>
                                <Grid item xs={12} sm={6} md={4} lg={4}>
                                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                                        <InputLabel id="type-select">Type</InputLabel>
                                        <Select
                                            labelId="type-select"
                                            id="type"
                                            name="type"
                                            value={formik.values.type}
                                            onChange={formik.handleChange}
                                            label="Type"
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            {
                                                typeOptions.map((type, index) => (
                                                    <MenuItem key={index} value={type.type}>{type.type}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                        {formik.errors.type && (
                                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                                {' '}
                                                {formik.errors.type}{' '}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4} lg={4}>
                                    <FormControl>
                                        <RadioGroup
                                            row
                                            aria-label="language"
                                            value={formik.values.language}
                                            onChange={formik.handleChange}
                                            name="language"
                                            id="language"
                                        >
                                            <FormControlLabel
                                                value="English"
                                                control={
                                                    <Radio
                                                        sx={{
                                                            color: 'primary.main',
                                                            '&.Mui-checked': { color: 'primary.main' }
                                                        }}
                                                    />
                                                }
                                                label="English"
                                            />
                                            <FormControlLabel
                                                value="Japanese"
                                                control={
                                                    <Radio
                                                        sx={{
                                                            color: 'error.main',
                                                            '&.Mui-checked': { color: 'error.main' }
                                                        }}
                                                    />
                                                }
                                                label="Japanese"
                                            />
                                            <FormControlLabel
                                                value="Hebrew"
                                                control={
                                                    <Radio
                                                        sx={{
                                                            color: 'secondary.main',
                                                            '&.Mui-checked': { color: 'secondary.main' }
                                                        }}
                                                    />
                                                }
                                                label="Hebrew"
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                    {formik.errors.language && (
                                        <FormHelperText error id="standard-weight-helper-text-email-login">
                                            {' '}
                                            {formik.errors.language}{' '}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12} sm={6} md={4} lg={4}>
                                    {/* Material Ui Date Picker */}
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            id="premiered"
                                            name="premiered"
                                            label="Premiered date picker"
                                            inputVariant="outlined"
                                            format="MM/dd/yyyy"
                                            value={parseISO(formik.values.premiered, "yyyy-M-dd'T'HH:mm:ss.SSSX", new Date())}
                                            onChange={value => formik.setFieldValue("premiered", value)}
                                            slotProps={{ textField: { variant: 'outlined' } }}

                                        />
                                    </LocalizationProvider>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="summary"
                                    name="summary"
                                    label="Movie summary"
                                    value={formik.values.summary}
                                    onChange={formik.handleChange}
                                    error={formik.touched.summary && Boolean(formik.errors.summary)}
                                    helperText={formik.touched.summary && formik.errors.summary}
                                    fullWidth
                                    autoComplete="given-name"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                    <Button color="error" onClick={handleCloseDialog}>
                                        Cancel
                                    </Button>
                                    <AnimateButton>
                                        <Button variant="contained" type="submit">
                                            Add
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

AddMovie.propTypes = {
    open: PropTypes.bool,
    handleCloseDialog: PropTypes.func,
    addMovie: PropTypes.func
};

export default AddMovie;
