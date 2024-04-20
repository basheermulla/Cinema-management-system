import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Button, CardActions, CardContent, CardMedia, Divider, Grid, Menu, MenuItem, Typography, LinearProgress } from '@mui/material';

// internal imports
import MainCard from 'components/cards/MainCard';
import SkeletonPopularCard from 'components/cards/Skeleton/PopularCard';
import useConfig from 'hooks/useConfig';
import { gridSpacing } from 'utils/constant-theme';

// assets
import BestMovie from 'assets/images/cinema/best_movies_6.png';
import { IconBrandYoutube } from '@tabler/icons-react';

const PopularMoviesCard = ({ isLoading, popular_movies, amountOfSubscription }) => {
    const theme = useTheme();

    const { borderRadius } = useConfig();

    return (
        <>
            {isLoading ? (
                <SkeletonPopularCard />
            ) : (
                <MainCard content={false}>
                    <CardContent>
                        <Grid container spacing={gridSpacing} sx={{ maxHeight: 620, minHeight: 620 }}>
                            <Grid item xs={12}>
                                <Grid container alignContent="center" justifyContent="space-between">
                                    <Grid item>
                                        <Typography variant="h4">Popular Movies</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sx={{ pt: '6px !important' }}>
                                <CardMedia
                                    component="img"
                                    image={BestMovie}
                                    sx={{ borderRadius: `${borderRadius}px`}}
                                    alt="external image"
                                />
                            </Grid>
                            {
                                popular_movies?.map((movie) => (
                                    <Grid item xs={12} key={movie._id} sx={{ pt: '12px !important' }}>
                                        <Grid container alignItems="center" justifyContent="space-between">
                                            <Grid item>
                                                <Grid container alignItems="center" spacing={1}>
                                                    <Grid item>
                                                        <CardMedia
                                                            component="img"
                                                            image={movie.image.medium}
                                                            sx={{ borderRadius: `${borderRadius}px`, width: 45, height: 60 }}
                                                            alt="external image"
                                                        />
                                                    </Grid>
                                                    <Grid item sx={{ width: { xs: 150, sm: 200, md: 80, lg: 130 } }}>
                                                        <Typography variant="subtitle1" sx={{ color: theme.palette.orange.dark }}>
                                                            {movie.name}
                                                        </Typography>
                                                        <Typography variant="subtitle1" sx={{ color: theme.palette.orange.dark }}>
                                                            <LinearProgress variant="determinate" value={movie.total_subscriptions/23 * 200} color="primary" aria-label="Popular movies percentage" />
                                                            {movie.total_subscriptions} views
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item>
                                                <Typography
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        color: theme.palette.error.main,
                                                        borderRadius: '12px',
                                                        padding: 1,
                                                        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : '#ffe9e9'
                                                    }}
                                                >
                                                    <IconBrandYoutube stroke={2} />
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Divider sx={{ mt: 1.5 }} />
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </CardContent>
                </MainCard>
            )}
        </>
    );
};

PopularMoviesCard.propTypes = {
    isLoading: PropTypes.bool,
    popular_movies: PropTypes.array,
    amountOfSubscription: PropTypes.number
};

export default PopularMoviesCard;