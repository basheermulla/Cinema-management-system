import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { Button, CardContent, CardMedia, Grid, Rating, Stack, Typography } from '@mui/material';

// internal import
import MainCard from './MainCard';
import SkeletonMoviePlaceholder from './Skeleton/MoviePlaceholder';
import { useDispatch, useSelector } from 'store';
// import { addProduct } from 'store/slices/cart'; // =======||  todo  ||======= //
// import { openSnackbar } from 'store/slices/snackbar'; // =======||  todo  ||======= //
import { getImageUrl, ImagePath } from 'utils/getImageUrl';

// assets
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone'; // =======||  todo  ||======= //

const MovieCard = ({ id, name, genres, image, type, language, premiered, rating }) => {
    const dispatch = useDispatch();

    const [movieRating] = useState(rating);

    const handleSubscribe = () => {
        // dispatch(subscribeMove(id));
    }

    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <>
            {
                isLoading ? (
                    <SkeletonMoviePlaceholder />
                ) : (
                    <MainCard
                        content={false}
                        boxShadow
                        sx={{
                            '&:hover': {
                                transform: 'scale3d(1.02, 1.02, 1)',
                                transition: 'all .4s ease-in-out'
                            }
                        }}
                    >
                        <CardMedia
                            sx={{ height: 360 }}
                            image={image.medium}
                            title="Cinema Movie"
                            component={Link}
                            to={`/cinema/movies/movie-details/${id}`}
                        />
                        <CardContent sx={{ p: 2 }}>
                            <Grid container spacing={0}>
                                <Grid item xs={12} sx={{ mb: 2 }}>
                                    <Typography
                                        component={Link}
                                        to={`/cinema/movies/movie-details/${id}`}
                                        variant="subtitle1"
                                        sx={{ textDecoration: 'none' }}
                                    >
                                        {name}
                                    </Typography>
                                    <Typography variant="h5" sx={{ color: 'grey.500' }}>({new Date(premiered).getFullYear()})</Typography>
                                </Grid>
                                <Grid container spacing={1}>                                
                                    {
                                        genres.map((genre, index) => (
                                            <Grid key={index} item>
                                                <Typography variant="p">
                                                    {genre}
                                                </Typography>

                                            </Grid>)
                                        )
                                    }
                                </Grid>
                                <Grid container spacing={1}>
                                    <Grid item>
                                        <Typography variant="h5" sx={{ color: 'grey.500' }}>{type}, </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h5" sx={{ color: 'grey.500' }}>{' ' + language}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Grid item xs={12} sx={{ pt: '8px !important' }}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Rating precision={0.5} name="size-small" value={movieRating} size="small" readOnly />
                                            </Stack>
                                        </Grid>
                                        <Button variant="contained" sx={{ minWidth: 0 }} onClick={handleSubscribe} aria-label="Subscribe movie">
                                            <ShoppingCartTwoToneIcon
                                                fontSize="small" // =======||  todo  ||======= //
                                            />
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </MainCard>
                )
            }
        </>
    );
};

MovieCard.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    genres: PropTypes.array,
    image: PropTypes.object,
    type: PropTypes.string,
    language: PropTypes.string,
    premiered: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.instanceOf(Date),
    ]).isRequired
    ,
    rating: PropTypes.string
};

export default MovieCard;
