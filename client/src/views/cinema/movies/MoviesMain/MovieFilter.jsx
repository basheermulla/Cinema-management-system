import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import {
    Button, CardContent, Checkbox, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Rating, Skeleton,
    Stack, Typography, useMediaQuery
} from '@mui/material';

// internal imports
import MainCard from 'components/cards/MainCard';
import Accordion from 'components/extended/Accordion';
import { gridSpacing } from 'utils/constant-theme';

const Type = ({ type, handelFilter }) => {
    const [isTypeLoading, setTypeLoading] = useState(true);
    useEffect(() => {
        setTypeLoading(false);
    }, []);

    return (
        <Stack direction="row" alignItems="center">
            {isTypeLoading ? (
                <Skeleton variant="rectangular" width="100%" height={42} />
            ) : (
                <>
                    <FormControlLabel
                        control={<Checkbox checked={type.some((item) => item === 'Scripted')} />}
                        onChange={() => handelFilter('type', 'Scripted')}
                        label="Scripted"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={type.some((item) => item === 'Reality')}
                                onChange={() => handelFilter('type', 'Reality')}
                                color="secondary"
                            />
                        }
                        label="Reality"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={type.some((item) => item === 'Animation')}
                                onChange={() => handelFilter('type', 'Animation')}
                                color="error"
                            />
                        }
                        label="Animation"
                    />
                </>
            )}
        </Stack>
    );
};

Type.propTypes = {
    type: PropTypes.array,
    handelFilter: PropTypes.func
};

const Genres = ({ genres, handelFilter }) => {
    const [isGenresLoading, setGenresLoading] = useState(true);
    useEffect(() => {
        setGenresLoading(false);
    }, []);

    return (
        <Grid container spacing={1}>
            {isGenresLoading ? (
                <Grid item xs={12}>
                    <Skeleton variant="rectangular" width="100%" height={200} />
                </Grid>
            ) : (
                <>
                    <Grid item xs={6}>
                        <FormControlLabel
                            control={<Checkbox checked={genres.some((item) => item === 'all')} />}
                            onChange={() => handelFilter('genres', 'all')}
                            label="All"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={genres.some((item) => item === 'Drama')} />}
                            onChange={() => handelFilter('genres', 'Drama')}
                            label="Drama"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={genres.some((item) => item === 'Science-Fiction')} />}
                            onChange={() => handelFilter('genres', 'Science-Fiction')}
                            label="Science-Fiction"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={genres.some((item) => item === 'Thriller')} />}
                            onChange={() => handelFilter('genres', 'Thriller')}
                            label="Thriller"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={genres.some((item) => item === 'Action')} />}
                            onChange={() => handelFilter('genres', 'Action')}
                            label="Action"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={genres.some((item) => item === 'Crime')} />}
                            onChange={() => handelFilter('genres', 'Crime')}
                            label="Crime"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={genres.some((item) => item === 'Horror')} />}
                            onChange={() => handelFilter('genres', 'Horror')}
                            label="Horror"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={genres.some((item) => item === 'Romance')} />}
                            onChange={() => handelFilter('genres', 'Romance')}
                            label="Romance"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={genres.some((item) => item === 'Adventure')} />}
                            onChange={() => handelFilter('genres', 'Adventure')}
                            label="Adventure"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={genres.some((item) => item === 'Espionage')} />}
                            onChange={() => handelFilter('genres', 'Espionage')}
                            label="Espionage"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={genres.some((item) => item === 'Music')} />}
                            onChange={() => handelFilter('genres', 'Music')}
                            label="Music"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControlLabel
                            control={<Checkbox checked={genres.some((item) => item === 'Mystery')} />}
                            onChange={() => handelFilter('genres', 'Mystery')}
                            label="Mystery"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={genres.some((item) => item === 'Supernatural')} />}
                            onChange={() => handelFilter('genres', 'Supernatural')}
                            label="Supernatural"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={genres.some((item) => item === 'Fantasy')} />}
                            onChange={() => handelFilter('genres', 'Fantasy')}
                            label="Fantasy"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={genres.some((item) => item === 'Family')} />}
                            onChange={() => handelFilter('genres', 'Family')}
                            label="Family"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={genres.some((item) => item === 'Anime')} />}
                            onChange={() => handelFilter('genres', 'Anime')}
                            label="Anime"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={genres.some((item) => item === 'Comedy')} />}
                            onChange={() => handelFilter('genres', 'Comedy')}
                            label="Comedy"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={genres.some((item) => item === 'History')} />}
                            onChange={() => handelFilter('genres', 'History')}
                            label="History"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={genres.some((item) => item === 'Medical')} />}
                            onChange={() => handelFilter('genres', 'Medical')}
                            label="Medical"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={genres.some((item) => item === 'Legal')} />}
                            onChange={() => handelFilter('genres', 'Legal')}
                            label="Legal"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={genres.some((item) => item === 'Western')} />}
                            onChange={() => handelFilter('genres', 'Western')}
                            label="Western"
                        />
                    </Grid>
                </>
            )}
        </Grid>
    );
};

Genres.propTypes = {
    genres: PropTypes.array,
    handelFilter: PropTypes.func
};

const Language = ({ language, handelFilter }) => {
    const [isLanguageLoading, setLanguageLoading] = useState(true);
    useEffect(() => {
        setLanguageLoading(false);
    }, []);

    return (
        <Stack direction="row" alignItems="center">
            {isLanguageLoading ? (
                <Skeleton variant="rectangular" width="100%" height={42} />
            ) : (
                <>
                    <FormControlLabel
                        control={<Checkbox checked={language.some((item) => item === 'English')} />}
                        onChange={() => handelFilter('language', 'English')}
                        label="English"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={language.some((item) => item === 'Japanese')}
                                onChange={() => handelFilter('language', 'Japanese')}
                                color="secondary"
                            />
                        }
                        label="Japanese"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={language.some((item) => item === 'Hebrew')}
                                onChange={() => handelFilter('language', 'Hebrew')}
                                color="error"
                            />
                        }
                        label="Hebrew"
                    />
                </>
            )}
        </Stack>
    );
};

Language.propTypes = {
    language: PropTypes.array,
    handelFilter: PropTypes.func
};

const Premiered = ({ premiered, handelFilter }) => {
    const [isPremieredLoading, setPremieredLoading] = useState(true);
    useEffect(() => {
        setPremieredLoading(false);
    }, []);

    return (
        <>
            {isPremieredLoading ? (
                <Skeleton variant="rectangular" width="100%" height={172} />
            ) : (
                <FormControl component="fieldset">
                    <RadioGroup
                        row
                        aria-label="layout"
                        value={premiered}
                        onChange={(e) => handelFilter('premiered', e.target.value)}
                        name="row-radio-buttons-group"
                    >
                        <Grid container spacing={0.25}>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    value="Last 5 years"
                                    control={<Radio />}
                                    label="Below $10"
                                    sx={{
                                        '& .MuiSvgIcon-root': { fontSize: 28 },
                                        '& .MuiFormControlLabel-label': { color: 'grey.900' }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    value="Last 6 to 10 years"
                                    control={<Radio />}
                                    label="$10 - $50"
                                    sx={{
                                        '& .MuiSvgIcon-root': { fontSize: 28 },
                                        '& .MuiFormControlLabel-label': { color: 'grey.900' }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    value="Last 11 to 15 years"
                                    control={<Radio />}
                                    label="$50 - $100"
                                    sx={{
                                        '& .MuiSvgIcon-root': { fontSize: 28 },
                                        '& .MuiFormControlLabel-label': { color: 'grey.900' }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    value="Last 16 to 20 years"
                                    control={<Radio />}
                                    label="$100 - $150"
                                    sx={{
                                        '& .MuiSvgIcon-root': { fontSize: 28 },
                                        '& .MuiFormControlLabel-label': { color: 'grey.900' }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    value="Last 21 to 30 years"
                                    control={<Radio />}
                                    label="$150 - $200"
                                    sx={{
                                        '& .MuiSvgIcon-root': { fontSize: 28 },
                                        '& .MuiFormControlLabel-label': { color: 'grey.900' }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    value="Over 30 years"
                                    control={<Radio />}
                                    label="Over $200"
                                    sx={{
                                        '& .MuiSvgIcon-root': { fontSize: 28 },
                                        '& .MuiFormControlLabel-label': { color: 'grey.900' }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </RadioGroup>
                </FormControl>
            )}
        </>
    );
};

Premiered.propTypes = {
    premiered: PropTypes.string,
    handelFilter: PropTypes.func
};

const RatingSection = ({ rating, handelFilter }) => {
    const [isRatingLoading, setRatingLoading] = useState(true);
    useEffect(() => {
        setRatingLoading(false);
    }, []);

    return (
        <>
            {isRatingLoading ? (
                <Skeleton variant="rectangular" width="100%" height={172} />
            ) : (
                <Stack direction="row" spacing={1} alignItems="center">
                    <Rating
                        precision={0.5}
                        name="simple-controlled"
                        value={rating}
                        onChange={(event, newValue) => handelFilter('rating', '', newValue)}
                    />
                    <Typography component="legend">({rating})</Typography>
                </Stack>
            )}
        </>
    );
};

RatingSection.propTypes = {
    rating: PropTypes.number,
    handelFilter: PropTypes.func
};

const MovieFilter = ({ filter, handelFilter }) => {
    const matchDownLG = useMediaQuery((theme) => theme.breakpoints.down('xl'));

    const filterData = [
        {
            id: 'type',
            defaultExpand: true,
            title: 'Type',
            content: <Type type={filter.type} handelFilter={handelFilter} />
        },
        {
            id: 'genres',
            defaultExpand: true,
            title: 'Genres',
            content: <Genres genres={filter.genres} handelFilter={handelFilter} />
        },
        {
            id: 'language',
            defaultExpand: true,
            title: 'Language',
            content: <Language language={filter.language} handelFilter={handelFilter} />
        },
        {
            id: 'premiered',
            defaultExpand: true,
            title: 'Premiered',
            content: <Premiered premiered={filter.premiered} handelFilter={handelFilter} />
        },
        {
            id: 'rating',
            defaultExpand: true,
            title: 'Rating',
            content: <RatingSection rating={filter.rating} handelFilter={handelFilter} />
        }
    ];

    return (
        <MainCard border={!matchDownLG} content={false} sx={{ overflow: 'visible' }}>
            <CardContent sx={{ p: 1, height: matchDownLG ? '100vh' : 'auto' }}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Accordion data={filterData} />
                    </Grid>
                    <Grid item xs={12} sx={{ m: 1 }}>
                        <Stack direction="row" justifyContent="center" alignItems="center">
                            <Button variant="contained" fullWidth color="error" onClick={() => handelFilter('reset', '')}>
                                Clear All
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </MainCard>
    );
};

MovieFilter.propTypes = {
    filter: PropTypes.object,
    handelFilter: PropTypes.func
};

export default MovieFilter;