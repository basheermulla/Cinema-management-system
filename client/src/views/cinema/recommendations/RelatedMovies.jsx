import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { Box, CardMedia, Stack, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// third-party
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// project imports
import MovieCard from 'components/cards/MovieCard';
import { getRelatedMovies } from 'store/slices/movie';
import useAuth from 'hooks/useAuth';
import { gridSpacing } from 'utils/constant-theme';
import Loader from 'components/Loader';

// assets
import { FaFastForward, FaFastBackward } from 'react-icons/fa'
import no_recommended_icon from 'assets/images/e-commerce/no-recommended-movies.svg';

function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <FaFastForward className={className} onClick={onClick} style={{ ...style, color: "gray", fontSize: "30px" }} />
    );
}

function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <FaFastBackward className={className} onClick={onClick} style={{ ...style, color: "gray", fontSize: "30px" }} />
    );
}

const RelatedMovies = ({ id, isLoading, handleClickOpenSubscribeDialog }) => {
    const theme = useTheme();
    const [related, setRelated] = useState([]);
    const [itemsToShow, setItemsToShow] = useState(5);
    const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
    const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));
    const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));
    const matchDownXL = useMediaQuery(theme.breakpoints.down('xl'));
    const matchUpXL = useMediaQuery(theme.breakpoints.up('xl'));

    const [loader, setLoader] = useState(true);



    // userLogin
    const { user: userLogin } = useAuth();

    useEffect(() => {
        (async () => {
            await getRelatedMovies(id).then((response) => {
                setRelated(response);
                setLoader(false);
            });
        })();
    }, [id]);

    useEffect(() => {
        if (matchDownSM) {
            setItemsToShow(1);
            return;
        }
        if (matchDownMD) {
            setItemsToShow(1);
            return;
        }
        if (matchDownLG) {
            setItemsToShow(2);
            return;
        }
        if (matchDownXL) {
            setItemsToShow(3);
            return;
        }
        if (matchUpXL) {
            setItemsToShow(3);
        }
    }, [matchDownSM, matchDownMD, matchDownLG, matchDownXL, matchUpXL, itemsToShow]);

    const settings = {
        dots: false,
        centerMode: true,
        swipeToSlide: true,
        focusOnSelect: true,
        centerPadding: '0px',
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        slidesToShow: itemsToShow
    };

    // Checking if a userLogin has a certain permission [View or Update or Create or Delete] for Subscriptions Model
    let subscriptionCheck_Roles = (permission_action) => {
        if (userLogin?.SubscriptionsRoles.includes(permission_action)) {
            return true;
        } else {
            return false;
        }
    }

    let movieResult = <></>;
    let alertNoRelatedMovies = <></>;
    if (related && related.length > 0 && !loader) {
        movieResult = related.map((movie, index) => (
            <Box key={index} sx={{ p: 1.5 }}>
                <MovieCard
                    key={index}
                    id={movie._id}
                    name={movie.name}
                    genres={movie.genres}
                    image={movie.image}
                    type={movie.type}
                    language={movie.language}
                    premiered={movie.premiered}
                    rating={movie.rating}
                    handleClickOpenSubscribeDialog={handleClickOpenSubscribeDialog}
                    subscriptionCheck_RolesCallback={subscriptionCheck_Roles}
                />
            </Box>

        ));
    }
    else {

        alertNoRelatedMovies = (
            <Box sx={{ p: 1.5 }}>
                {/* <Typography>No related movies</Typography> */}
                <Stack alignItems="center" spacing={gridSpacing}>
                    <CardMedia
                        component="img"
                        image={theme.palette.mode === 'dark' ? no_recommended_icon : no_recommended_icon}
                        title="Slider5 image"
                        sx={{ maxWidth: 350 }}
                    />
                    <Stack spacing={1}>
                        <Typography variant="h3" color="inherit" component="div" align="center">
                            Oops! Something went wrong.....
                        </Typography>
                        <Typography variant="h3" color="inherit" align="center">This member has no recommended movies</Typography>
                    </Stack>
                </Stack>
            </Box>)
    }

    //=========================================================================================================================================
    //==                                               ✔️▶️🎬 Loading Page 🎬▶️✔️                                                         ==
    //=========================================================================================================================================
    if (loader) return <Loader />;

    return (
        <>
            {related && related.length > 0 && <Slider {...settings}>{movieResult}</Slider>}
            {related.length === 0 && !loader && <>{alertNoRelatedMovies}</>}
        </>
    );
};

RelatedMovies.propTypes = {
    id: PropTypes.string,
    isLoading: PropTypes.bool,
    handleClickOpenSubscribeDialog: PropTypes.func
};

export default RelatedMovies;