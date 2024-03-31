import PropTypes from 'prop-types';
import { useEffect, useState, ReactElement } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, Container, Grid, TableContainer, useMediaQuery } from '@mui/material';

// third-party
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// project imports
import MovieCard from 'components/cards/MovieCard';
import { getRelatedMovies } from 'store/slices/movie';

// assets
import { FaFastForward, FaFastBackward } from 'react-icons/fa'

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

    useEffect(() => {
        (async () => {
            await getRelatedMovies(id).then((response) => {
                console.log(response?.length);
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
            setItemsToShow(2);
            return;
        }
        if (matchDownLG) {
            setItemsToShow(3);
            return;
        }
        if (matchDownXL) {
            setItemsToShow(4);
            return;
        }
        if (matchUpXL) {
            setItemsToShow(5);
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

    let movieResult = <></>;
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
                />
            </Box>
        ));
    }

    return (
        <>
            {related && related.length > 0 && <Slider {...settings}>{movieResult}</Slider>}
        </>
    );
};

RelatedMovies.propTypes = {
    id: PropTypes.string,
    isLoading: PropTypes.bool,
    handleClickOpenSubscribeDialog: PropTypes.func
};

export default RelatedMovies;
