import PropTypes from 'prop-types';
import { useEffect, useState, useMemo } from 'react';
import { Link, useLoaderData, useLocation, useParams } from 'react-router-dom';

// material-ui
import { Box, Grid, Stack, Tab, Tabs, Typography } from '@mui/material';

// internal imports
import MovieSubscriptions from './MovieSubscriptions/index';
import MovieUpdate from './MovieUpdate';
import MovieDescriptionCard from 'components/cards/MovieDescriptionCard';
import MainCard from 'components/cards/MainCard';
import Chip from 'components/extended/Chip';
import { updateMovie, deleteMovie } from 'store/slices/movie';

import { useDispatch, useSelector } from 'store/index';
import { gridSpacing } from 'utils/constant-theme';

function TabPanel({ children, value, index, ...other }) {
    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`movie-details-tabpanel-${index}`}
            aria-labelledby={`movie-details-tab-${index}`}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </Box>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

function a11yProps(index) {
    return {
        id: `movie-details-tab-${index}`,
        'aria-controls': `movie-details-tabpanel-${index}`
    };
}

const MovieDetails = () => {
    const { id } = useParams();

    // movie data
    const initialMovie = useLoaderData();

    const [movie, setMovie] = useState(initialMovie[0]);

    const dispatch = useDispatch();

    // movie description tabs
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const editMovie = (id, movieEdit) => {
        dispatch(updateMovie(id, movieEdit));
    };

    const removeMovie = (id) => {
        dispatch(deleteMovie(id));
    };

    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <>
            {movie && movie._id === id && (
                <Grid container alignItems="center" justifyContent="center" spacing={gridSpacing}>
                    <Grid item xs={12} lg={12}>
                        <MainCard>
                            {movie && movie?._id === id && (
                                <Grid container spacing={gridSpacing}>
                                    <Grid item xs={12}>
                                        <MovieDescriptionCard
                                            id={movie._id}
                                            name={movie.name}
                                            genres={movie.genres}
                                            image={movie.image}
                                            type={movie.type}
                                            language={movie.language}
                                            summary={movie.summary}
                                            premiered={movie.premiered}
                                            rating={movie.rating}
                                            removeMovie={removeMovie}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Tabs
                                            value={value}
                                            indicatorColor="primary"
                                            onChange={handleChange}
                                            sx={{}}
                                            aria-label="movie subscription tabs"
                                            variant="scrollable"
                                        >
                                            <Tab component={Link}
                                                to="#"
                                                label={
                                                    <Stack direction="row" alignItems="center">
                                                        Subscriptions watched{' '}
                                                        <Chip
                                                            label={String(movie.subscriptionWatched?.length.toFixed(0))}
                                                            size="small"
                                                            chipcolor="secondary"
                                                            sx={{ ml: 1.5 }}
                                                        />
                                                    </Stack>
                                                }
                                                {...a11yProps(0)}
                                            />
                                            <Tab component={Link} to="#" label="Update movie" {...a11yProps(1)} />
                                        </Tabs>
                                        <TabPanel value={value} index={0}>
                                            <MovieSubscriptions movie={movie} />
                                        </TabPanel>
                                        <TabPanel value={value} index={1}>
                                            <MovieUpdate editMovie={editMovie} movie={movie} />
                                        </TabPanel>
                                    </Grid>
                                </Grid>
                            )}
                        </MainCard>
                    </Grid>
                </Grid>
            )}
        </>
    )
}

export default MovieDetails;