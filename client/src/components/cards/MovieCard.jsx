import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { CardContent, CardMedia, Grid, Rating, Typography, IconButton } from '@mui/material';

// internal import
import MainCard from './MainCard';
import SkeletonMoviePlaceholder from './Skeleton/MoviePlaceholder';
import { useDispatch } from 'store';
import AnimateButton from 'components/extended/AnimateButton';
import useAuth from 'hooks/useAuth';
// import { openSnackbar } from 'store/slices/snackbar'; // =======||  todo  ||======= //

// assets
import { IconMovie, IconWorld, IconSquareRoundedPlusFilled, IconCircleLetterG, IconCalendarClock } from '@tabler/icons-react';

const MovieCard = ({ id, name, genres, image, type, language, premiered, rating, handleClickOpenSubscribeDialog, subscriptionCheck_RolesCallback }) => {
    const dispatch = useDispatch();

    const [movieRating] = useState(rating);

    // userLogin
    const { user: userLogin } = useAuth();

    const handleSubscribe = () => {
        const movieId = { movieId: id };
        handleClickOpenSubscribeDialog(movieId)
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
                            },
                            // height: '100%'
                        }}
                    >
                        <Grid container justifyContent="space-between" height='100%' alignItems="center" >
                            <Grid container spacing={0}>
                                <Grid item xs={12}>
                                    <CardMedia
                                        sx={{ height: 520 }}
                                        image={image.original}
                                        title="Cinema Movie"
                                        component={Link}
                                        to={`/cinema/movies/movie-details/${id}`}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <CardContent sx={{ p: 2 }}>
                                        <Grid item container>
                                            <Grid item xs={12} sx={{ mb: 1 }}>
                                                <Typography
                                                    component={Link}
                                                    to={`/cinema/movies/movie-details/${id}`}
                                                    variant="h4"
                                                    sx={{ textDecoration: 'none' }}
                                                >
                                                    {name}
                                                </Typography>
                                                &nbsp;({new Date(premiered).getFullYear()})
                                            </Grid>
                                            <Grid item xs={12} sx={{ mb: 1 }}>
                                                <Grid container direction="row" justifyContent="left" alignItems="center" sx={{ color: 'grey.500' }}>
                                                    <IconMovie size={16} stroke={1} /> &nbsp; {type}
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12} sx={{ mb: 1 }}>
                                                <Grid container spacing={1}>
                                                    <Grid item><IconCircleLetterG size={16} stroke={1} /></Grid>
                                                    {
                                                        genres.map((genre, index) => (
                                                            <Grid key={index} item sx={{ color: 'grey.500' }}>
                                                                <Typography variant="p">
                                                                    {genre}
                                                                </Typography>

                                                            </Grid>)
                                                        )
                                                    }
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12} sx={{ mb: 1 }}>
                                                <Grid container direction="row" justifyContent="left" alignItems="center" sx={{ color: 'grey.500' }}>
                                                    <IconWorld size={16} stroke={1} /> &nbsp; {language}
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12} sx={{ mb: 1 }}>
                                                <Grid container direction="row" sx={{ color: 'grey.500' }}>
                                                    <Rating precision={0.1} name="size-small" value={movieRating} max={10} size="small" readOnly />
                                                    <Typography>&nbsp;({rating})</Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} textAlign="center">
                                {subscriptionCheck_RolesCallback('C') && <AnimateButton >
                                    <IconButton color="primary" onClick={handleSubscribe} aria-label="Subscribe a movie">
                                        <IconSquareRoundedPlusFilled size={36} />
                                    </IconButton>
                                </AnimateButton>}
                            </Grid>
                        </Grid>
                    </MainCard >
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
    rating: PropTypes.number,
    handleClickOpenSubscribeDialog: PropTypes.func,
    subscriptionCheck_RolesCallback: PropTypes.func
};

export default MovieCard;
