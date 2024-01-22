import { useEffect, useState } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import {
    Box, Button, Divider, Drawer, Fab, Grid, IconButton, InputAdornment, Menu, MenuItem, Stack, TextField,
    Tooltip, Typography, useMediaQuery
} from '@mui/material';
import AddIcon from '@mui/icons-material/AddTwoTone';

// third party
import PerfectScrollbar from 'react-perfect-scrollbar';

// internal imports
import SortOptions from './SortOptions';
import MovieEmpty from './MovieEmpty';
import MovieFilter from './MovieFilter';
import MovieFilterView from './MovieFilterView';

import MovieCard from 'components/cards/MovieCard';
import SkeletonMoviePlaceholder from 'components/cards/Skeleton/MoviePlaceholder';

import useConfig from 'hooks/useConfig';
import { useDispatch, useSelector } from 'store/index';
import { appDrawerWidth, gridSpacing } from 'utils/constant-theme';
import { filterMovies, createMovie } from 'store/slices/movie';
import AddMovie from './AddMovie';

// assets
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// movie list container
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.shorter
    }),
    marginRight: -appDrawerWidth,
    [theme.breakpoints.down('xl')]: {
        paddingRight: 0,
        marginRight: 0
    },
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.shorter
        }),
        marginRight: 0
    })
}));

const MoviesMain = () => {
    const theme = useTheme();
    
    const { borderRadius } = useConfig();
    const dispatch = useDispatch();

    // const mov = useSelector((state) => state.movies);

    const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));
    const matchDownLG = useMediaQuery(theme.breakpoints.down('xl'));

    const [movieLoading, setMovieLoading] = useState(true);

    useEffect(() => {
        setMovieLoading(false);
    }, []);

    // drawer
    const [open, setOpen] = useState(movieLoading);

    const handleDrawerOpen = () => {
        setOpen((prevState) => !prevState);
    };

    // movie data
    const initialMovies = useLoaderData();    
    const [movies, setMovies] = useState(initialMovies);
    console.log(initialMovies);

    // filter
    const initialState = {
        search: '',
        sort: 'low',
        type: [],
        genres: ['all'],
        language: [],
        premiered: '',
        rating: 0
    };
    const [filter, setFilter] = useState(initialState);

    // search filter
    const handleSearch = async (event) => {
        const newString = event?.target.value;
        setFilter({ ...filter, search: newString });
    };

    // sort options
    const [anchorEl, setAnchorEl] = useState(null);
    const openSort = Boolean(anchorEl);
    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const filterIsEqual = (a1, a2) =>
        a1 === a2 ||
        (a1.length === a2.length &&
            a1.search === a2.search &&
            a1.sort === a2.sort &&
            a1.premiered === a2.premiered &&
            a1.rating === a2.rating &&
            JSON.stringify(a1.type) === JSON.stringify(a2.type) &&
            JSON.stringify(a1.genres) === JSON.stringify(a2.genres) &&
            JSON.stringify(a1.language) === JSON.stringify(a2.language));

    const handelFilter = (typeFilter, params, rating) => {
        setMovieLoading(true);
        switch (typeFilter) {
            case 'type':
                if (filter.type.some((item) => item === params)) {
                    setFilter({ ...filter, type: filter.type.filter((item) => item !== params) });
                } else {
                    setFilter({ ...filter, type: [...filter.type, params] });
                }
                break;
            case 'genres':
                if (filter.genres.some((item) => item === params)) {
                    setFilter({ ...filter, genres: filter.genres.filter((item) => item !== params) });
                } else if (filter.genres.some((item) => item === 'all') || params === 'all') {
                    setFilter({ ...filter, genres: [params] });
                } else {
                    setFilter({ ...filter, genres: [...filter.genres, params] });
                }

                break;
            case 'language':
                if (filter.language.some((item) => item === params)) {
                    setFilter({ ...filter, language: filter.language.filter((item) => item !== params) });
                } else {
                    setFilter({ ...filter, language: [...filter.language, params] });
                }
                break;
            case 'premiered':
                setFilter({ ...filter, premiered: params });
                break;
            case 'search':
                setFilter({ ...filter, search: params });
                break;
            case 'sort':
                setFilter({ ...filter, sort: params });
                break;
            case 'rating':
                setFilter({ ...filter, rating });
                break;
            case 'reset':
                setFilter(initialState);
                break;
            default:
            // no options
        }
    };

    const filterData = async () => {
        console.log('await filterMovies()');
        // const movies = await filterMovies();
        // setMovies(movies);
        setMovieLoading(false);
    };

    useEffect(() => {
        filterData();        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    useEffect(() => {
        setOpen(!matchDownLG);
    }, [matchDownLG]);

    // sort filter
    const handleMenuItemClick = (event, index) => {
        setFilter({ ...filter, sort: index });
        setAnchorEl(null);
    };

    const addMovie = (movieNew) => {
        dispatch(createMovie(movieNew));
    };

    const sortLabel = SortOptions.filter((items) => items.value === filter.sort);

    let movieResult = <></>;
    if (movies && movies.length > 0) {
        movieResult = movies.map((movie, index) => (
            <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                <MovieCard
                    id={movie._id}
                    name={movie.name}
                    genres={movie.genres}
                    image={movie.image}
                    type={movie.type}
                    language={movie.language}
                    premiered={movie.premiered}
                    rating={movie.rating}
                />
            </Grid>
        ));
    } else {
        movieResult = (
            <Grid item xs={12} sx={{ mt: 3 }}>
                <MovieEmpty />
            </Grid>
        );
    }

    // open a dialog alert when clicked on new movie
    const [openAddDialog, setOpenAddDialog] = useState(false);

    const handleClickOpenDialog = () => {
        setOpenAddDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenAddDialog(false);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between" spacing={matchDownMD ? 0.5 : 2}>
                    <Grid item>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="h3">Movies</Typography>
                            <IconButton size="large" aria-label="go to subscription">
                                <ArrowForwardIosIcon sx={{ width: '0.875rem', height: '0.875rem', fontWeight: 500, color: 'grey.500' }} />
                            </IconButton>
                        </Stack>
                    </Grid>
                    <Grid item>
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={{ xs: 0.5, sm: 1, md: 1.5 }}>
                            {/* product add & dialog */}
                            <Tooltip title="Add Product">
                                <Fab
                                    color="primary"
                                    size="small"
                                    onClick={handleClickOpenDialog}
                                    sx={{ boxShadow: 'none', ml: 1, width: 32, height: 32, minHeight: 32 }}
                                >
                                    <AddIcon fontSize="small" />
                                </Fab>
                            </Tooltip>
                            <TextField
                                sx={{ width: { xs: 140, md: 'auto' } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" />
                                        </InputAdornment>
                                    )
                                }}
                                value={filter.search}
                                placeholder="Search Movie"
                                size="small"
                                onChange={handleSearch}
                            />

                            <Typography sx={{ pl: 1.5, fontSize: '1rem', color: 'grey.500', fontWeight: 400 }}>|</Typography>

                            <Button
                                disableRipple
                                onClick={handleDrawerOpen}
                                color="secondary"
                                startIcon={<FilterAltIcon sx={{ fontWeight: 500, color: 'secondary.200' }} />}
                            >
                                Filter
                            </Button>

                            <Typography sx={{ display: { xs: 'none', sm: 'flex' }, fontSize: '1rem', color: 'grey.500', fontWeight: 400 }}>
                                |
                            </Typography>
                            <Stack direction="row" alignItems="center" justifyContent="center" sx={{ display: { xs: 'none', sm: 'flex' } }}>
                                <Typography variant="h5">Sort by: </Typography>
                                <Button
                                    id="demo-positioned-button"
                                    aria-controls="demo-positioned-menu"
                                    aria-haspopup="true"
                                    aria-expanded={openSort ? 'true' : undefined}
                                    onClick={handleClickListItem}
                                    sx={{ color: 'grey.500', fontWeight: 400 }}
                                    endIcon={<KeyboardArrowDownIcon />}
                                >
                                    {sortLabel.length > 0 && sortLabel[0].label}
                                </Button>
                                <Menu
                                    id="demo-positioned-menu"
                                    aria-labelledby="demo-positioned-button"
                                    anchorEl={anchorEl}
                                    open={openSort}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right'
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right'
                                    }}
                                >
                                    {SortOptions.map((option, index) => (
                                        <MenuItem
                                            sx={{ p: 1.5 }}
                                            key={index}
                                            selected={option.value === filter.sort}
                                            onClick={(event) => handleMenuItemClick(event, option.value)}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Divider sx={{ borderColor: 'grey.400' }} />
            </Grid>
            <Grid item xs={12}>
                <Box sx={{ display: 'flex' }}>
                    <Main open={open}>
                        <MovieFilterView
                            filter={filter}
                            filterIsEqual={filterIsEqual}
                            handelFilter={handelFilter}
                            initialState={initialState}
                        />
                        <Grid container spacing={gridSpacing}>
                            {movieLoading
                                ? [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                                    <Grid key={item} item xs={12} sm={6} md={4} lg={3}>
                                        <SkeletonMoviePlaceholder />
                                    </Grid>
                                ))
                                : movieResult}
                        </Grid>
                    </Main>
                    <Drawer
                        sx={{
                            ml: open ? 3 : 0,
                            height: matchDownLG ? '100vh' : 'auto',
                            flexShrink: 0,
                            zIndex: { xs: 1200, lg: open ? 1000 : -1 },
                            overflowX: 'hidden',
                            width: appDrawerWidth,
                            '& .MuiDrawer-paper': {
                                height: 'auto',
                                width: appDrawerWidth,
                                position: matchDownLG ? 'fixed' : 'relative',
                                border: 'none',
                                borderRadius: matchDownLG ? 0 : `${borderRadius}px`
                            }
                        }}
                        variant={matchDownLG ? 'temporary' : 'persistent'}
                        anchor="right"
                        open={open}
                        ModalProps={{ keepMounted: true }}
                        onClose={handleDrawerOpen}
                    >
                        {open && (
                            <PerfectScrollbar component="div">
                                <MovieFilter filter={filter} handelFilter={handelFilter} />
                            </PerfectScrollbar>
                        )}
                    </Drawer>
                </Box>
            </Grid>
            <AddMovie open={openAddDialog} handleCloseDialog={handleCloseDialog} addMovie={addMovie}/>
        </Grid>
    )
}

export default MoviesMain;