import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useLoaderData } from 'react-router-dom';

// material-ui
import {
    Box, Button, Divider, Drawer, Fab, Grid, IconButton, InputAdornment, Menu, MenuItem, Stack, TextField,
    Tooltip, Typography, useMediaQuery
} from '@mui/material';
import AddIcon from '@mui/icons-material/AddTwoTone';
import { styled, useTheme } from '@mui/material/styles';

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
import { filterMovies, createMovie, getPerPageMovies } from 'store/slices/movie';
import { createSubscription, getMembers } from 'store/slices/member';
import AddMovie from './AddMovie';
import AddSubscriptionByMember from './AddSubscriptionByMember';
import useAuth from 'hooks/useAuth';
import CircularIndeterminate from "components/CircularIndeterminate";
import Loader from 'components/Loader';

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

    // userLogin
    const { user: userLogin } = useAuth();

    //=========================================================================================================================================
    //==                                    ✔️▶️🎬 pagination with scroll up and down 🎬▶️✔️                                              ==
    //=========================================================================================================================================

    const [page, setPage] = useState(1); // State to keep track of the current page
    const [perPage, setPerPage] = useState(Math.round(window.innerHeight / 100) - (Math.round(window.innerHeight / 100) % 10)); // Number of movies per page

    // movies data
    const initialMovies = useLoaderData();
    const [movies, setMovies] = useState(initialMovies.movies);
    const [countPages, setCountPages] = useState(initialMovies.totalPages);
    const [pageLoading, setPageLoading] = useState(false);

    // Set a perPage when window.innerHeight changed
    useEffect(() => {
        setPerPage(Math.round(window.innerHeight / 100) - (Math.round(window.innerHeight / 100) % 10));
    }, [window.innerHeight]);

    useEffect(() => {
        // Function to fetch more data
        const fetchData = async () => {

            try {
                const response = await getPerPageMovies(page, perPage);
                setMovies(prevData => [...prevData, ...response]); // Append new data to existing data
                setPageLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (page <= countPages && page > 1) {
            fetchData();
        } else {
            setPageLoading(false);
        }
    }, [page]);

    // Function to handle scrolling down
    const handleScrollDown = () => {
        // console.log("if condition = ", document.documentElement.offsetHeight - (window.innerHeight + document.documentElement.scrollTop));
        if (document.documentElement.offsetHeight - (window.innerHeight + document.documentElement.scrollTop) <= 1 && areEqual(filter, initialState) && areEqual(filterSearchAndSort, initialSearchAndSort)) {
            setPageLoading(true);
            setPage(prevPage => prevPage + 1); // Increment page number
            console.log("page-in-Increment = ", page);
        }
    };

    // Function to handle scrolling up
    const handleScrollUp = () => {
        if (document.documentElement.scrollTop === 0) {
            console.log("page-out = ", page);
        }
    };

    // Function to handle scrolling
    const handleScroll = () => {
        handleScrollDown();
        handleScrollUp();
    };

    // ===== ▶️🎬 Define the initialState filter and initialSearchAndSort filter and filters' useState before an eventListener to able to use it =====🎬▶️
    // filter
    const initialState = {                                                                                                                              //==
        type: [],                                                                                                                                       //==
        genres: ['all'],                                                                                                                                //==
        language: [],                                                                                                                                   //==
        premiered: '',                                                                                                                                  //==
        rating: 0                                                                                                                                       //==
    };                                                                                                                                                  //==

    // filter
    const initialSearchAndSort = {                                                                                                                      //==
        search: '',                                                                                                                                     //==
        sort: 'in order',                                                                                                                               //==
    };                                                                                                                                                  //==

    const [filter, setFilter] = useState(initialState);                                                                                                 //==
    const [filterSearchAndSort, setFilterSearchAndSort] = useState(initialSearchAndSort);                                                               //==
    //------------------------------------------------------------------------------------------------------------------------------------------------------
    // Add scroll event listener when component mounts
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [page, filter, filterSearchAndSort]); // Empty dependency array ensures that the effect runs only once

    function areEqual(obj1, obj2) {
        const str1 = JSON.stringify(obj1, sortKeys);
        const str2 = JSON.stringify(obj2, sortKeys);
        return str1 === str2;
    }

    function sortKeys(key, value) {
        if (Array.isArray(value)) {
            return value.sort();
        }
        return value;
    }

    //=========================================================================================================================================
    //==                                                  ▶️🎬 Start filter 🎬▶️                                                           ==
    //=========================================================================================================================================

    // search filter
    const handleSearch = async (event) => { ////////////////////////////////*************************** Search */
        const newString = event?.target.value;
        setFilterSearchAndSort({ ...filterSearchAndSort, search: newString });
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
            a1.premiered === a2.premiered &&
            a1.rating === a2.rating &&
            JSON.stringify(a1.type) === JSON.stringify(a2.type) &&
            JSON.stringify(a1.genres) === JSON.stringify(a2.genres) &&
            JSON.stringify(a1.language) === JSON.stringify(a2.language));

    const filterSearchAndSortIsEqual = (a1, a2) =>
        a1 === a2 ||
        (a1.length === a2.length &&
            a1.search === a2.search &&
            a1.sort === a2.sort);

    const handelFilter = (typeFilter, params, rating) => {
        setMovieLoading(true);
        switch (typeFilter) {
            case 'type':
                if (filter.type.some((item) => item === params)) {
                    setFilter({ ...filter, type: filter.type.filter((item) => item !== params) });
                    setMovieLoading(false);
                } else {
                    setFilter({ ...filter, type: [...filter.type, params] });
                    setMovieLoading(false);
                }
                break;
            case 'genres':
                if (filter.genres.some((item) => item === params)) {
                    setFilter({ ...filter, genres: filter.genres.filter((item) => item !== params) });
                    setMovieLoading(false);
                } else if (filter.genres.some((item) => item === 'all') || params === 'all') {
                    setFilter({ ...filter, genres: [params] });
                    setMovieLoading(false);
                } else {
                    setFilter({ ...filter, genres: [...filter.genres, params] });
                    setMovieLoading(false);
                }

                break;
            case 'language':
                if (filter.language.some((item) => item === params)) {
                    setFilter({ ...filter, language: filter.language.filter((item) => item !== params) });
                    setMovieLoading(false);
                } else {
                    setFilter({ ...filter, language: [...filter.language, params] });
                    setMovieLoading(false);
                }
                break;
            case 'premiered':
                setFilter({ ...filter, premiered: params });
                setMovieLoading(false);
                break;
            case 'search':
                setFilterSearchAndSort({ ...filterSearchAndSort, search: params });
                setMovieLoading(false);
                break;
            case 'sort':
                setFilterSearchAndSort({ ...filterSearchAndSort, sort: params });
                setMovieLoading(false);
                break;
            case 'rating':
                setFilter({ ...filter, rating });
                setMovieLoading(false);
                break;
            case 'reset':
                setFilter(initialState);
                setFilterSearchAndSort(initialSearchAndSort);
                setMovieLoading(false);
                break;
            default:
            // no options
        }
    };

    const filterData = async () => {
        await filterMovies(filter, page, perPage).then((response) => {
            setMovies(response);
            console.log('response filter = ', response);
            setMovieLoading(false);
        });
    };

    useEffect(() => {
        filterData();
    }, [filter]);

    //=========================================================================================================================================
    //==                                                  ▶️🎬 members data 🎬▶️                                                           ==
    //=========================================================================================================================================
    const [members, setMembers] = useState([]);

    useEffect(() => {
        // Function to get members data
        const getMembersdata = async () => {
            try {
                const response = await getMembers();
                console.log(response);
                setMembers(response);
            } catch (error) {
                console.error('Error fetching members:', error);
            }
        };

        if (movies && movies.length > 0) {
            getMembersdata()
        }
        console.log(members);
    }, []);
    //------------------------------------------------------------------------------------------------------------------------------------------

    useEffect(() => {
        setOpen(!matchDownLG);
    }, [matchDownLG]);

    // sort filter
    const handleMenuItemClick = (event, index) => {
        setFilterSearchAndSort({ ...filterSearchAndSort, sort: index });
        setAnchorEl(null);
    };

    const addSubscriptionByMember = (method, memberId, obj_SubscriptionMovie) => {
        dispatch(createSubscription(method, memberId.id, obj_SubscriptionMovie));
    };

    // movieId state for creating a new subscription for a desired member
    const [movieId, setMovieId] = useState({});

    // open a dialog alert when clicking on subscribe in a certain movie
    const [openSubscribeDialog, setOpenSubscribeDialog] = useState(false);

    const handleClickOpenSubscribeDialog = (newMovieId) => {
        setOpenSubscribeDialog(true);
        setMovieId(newMovieId);
    };

    const handleCloseSubscribeDialog = () => {
        setMovieId(null);
        setOpenSubscribeDialog(false);
    };

    const sortLabel = SortOptions.filter((items) => items.value === filterSearchAndSort.sort);

    // Checking if a userLogin has a certain permission [View or Update or Create or Delete] for Movies Model
    let moviesCheck_Roles = (permission_action) => {
        if (userLogin?.MoviesRoles.includes(permission_action)) {
            return true;
        } else {
            return false;
        }
    }

    // Checking if a userLogin has a certain permission [View or Update or Create or Delete] for Subscriptions Model
    let subscriptionCheck_Roles = (permission_action) => {
        if (userLogin?.SubscriptionsRoles.includes(permission_action)) {
            return true;
        } else {
            return false;
        }
    }

    let movieResult = <></>;
    if (movies && movies.length > 0) {
        const showMovies = [...movies];
        movieResult = showMovies

            .filter((item) => item.name.toLowerCase().includes(filterSearchAndSort.search.toLowerCase()))
            .sort((movie_A, movie_B) => {
                switch (filterSearchAndSort.sort) {
                    case "in order":
                        return 0;
                    case "low":
                        return movie_A.name.localeCompare(movie_B.name);
                    case "high":
                        return movie_B.name.localeCompare(movie_A.name);
                    case "rating":
                        return (+movie_B.rating) - (+movie_A.rating);
                    case "premiered":
                        return -(movie_A.premiered.localeCompare(movie_B.premiered));
                    default:
                        break;
                }
            })
            .map((movie, index) => {

                if (showMovies.length === index + 1) {
                    return (
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
                                handleClickOpenSubscribeDialog={handleClickOpenSubscribeDialog}
                                subscriptionCheck_RolesCallback={subscriptionCheck_Roles}
                            />
                        </Grid>
                    );
                } else {
                    return (
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
                                handleClickOpenSubscribeDialog={handleClickOpenSubscribeDialog}
                                subscriptionCheck_RolesCallback={subscriptionCheck_Roles}
                            />
                        </Grid>
                    );
                }
            });
    } else {
        movieResult = (
            <Grid item xs={12} sx={{ mt: 3 }}>
                <MovieEmpty />
            </Grid>
        );
    }

    const addMovie = (movieNew) => {
        dispatch(createMovie(movieNew));
    };

    // open a dialog alert when clicking on a new movie
    const [openAddDialog, setOpenAddDialog] = useState(false);

    const handleClickOpenDialog = () => {
        setOpenAddDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenAddDialog(false);
    };

    //=========================================================================================================================================
    //==                                               ✔️▶️🎬 Loading Page 🎬▶️✔️                                                         ==
    //=========================================================================================================================================
    if (movieLoading) return <Loader />;

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between" spacing={matchDownMD ? 0.5 : 2}>
                    <Grid item>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="h3"> Movies </Typography>
                            <IconButton size="large" aria-label="go to subscription">
                                <ArrowForwardIosIcon sx={{ width: '0.875rem', height: '0.875rem', fontWeight: 500, color: 'grey.500' }} />
                            </IconButton>
                        </Stack>
                    </Grid>
                    <Grid item>
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={{ xs: 0.5, sm: 1, md: 1.5 }}>
                            {/* product add & dialog */}
                            {moviesCheck_Roles('C') && <Tooltip title="Add Movie">
                                <Fab
                                    color="primary"
                                    size="small"
                                    onClick={handleClickOpenDialog}
                                    sx={{ boxShadow: 'none', ml: 1, width: 32, height: 32, minHeight: 32 }}
                                >
                                    <AddIcon fontSize="small" />
                                </Fab>
                            </Tooltip>}
                            <TextField
                                sx={{ width: { xs: 140, md: 'auto' } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" />
                                        </InputAdornment>
                                    )
                                }}
                                value={filterSearchAndSort.search}
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
                                            selected={option.value === filterSearchAndSort.sort}
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
                            filterSearchAndSort={filterSearchAndSort}
                            filterIsEqual={filterIsEqual}
                            filterSearchAndSortIsEqual={filterSearchAndSortIsEqual}
                            handelFilter={handelFilter}
                            initialState={initialState}
                            initialSearchAndSort={initialSearchAndSort}
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
                        {open && !movieLoading && (
                            <PerfectScrollbar component="div">
                                <MovieFilter filter={filter} handelFilter={handelFilter} />
                            </PerfectScrollbar>
                        )}
                    </Drawer>
                </Box>
            </Grid>
            <Grid item xs={12} alignItems="center" justifyContent="space-between">
                {pageLoading && (
                    <Stack direction="row" alignItems="center" justifyContent="center" sx={{ display: { xs: 'none', sm: 'flex' } }}>
                        <CircularIndeterminate />
                    </Stack>)}
            </Grid>
            <AddMovie open={openAddDialog} handleCloseDialog={handleCloseDialog} addMovie={addMovie} />
            <AddSubscriptionByMember
                open={openSubscribeDialog}
                movieId={movieId}
                handleCloseSubscribeDialog={handleCloseSubscribeDialog}
                addSubscriptionByMember={addSubscriptionByMember}
                members={members}
            />
        </Grid>

    )
}

export default MoviesMain;