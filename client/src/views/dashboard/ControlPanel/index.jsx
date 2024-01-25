import { useEffect, useState, useCallback } from 'react';
import { useLoaderData } from 'react-router-dom';
// material-ui
import { Grid, Stack } from '@mui/material';

// project imports
import AmountMoviesCard from './AmountMoviesCard';
import TotalSubscriptionsCard from './TotalSubscriptionsCard';
// import GenresPieChart from './GenresPieChart';
import UsersOnlineCard from './UsersOnlineCard';
import MembersAmountCard from './MembersAmountCard';
import TotalSubscriptionBarChart from './TotalSubscriptionBarChart';
import PopularMoviesCard from './PopularMoviesCard';
import { gridSpacing } from 'utils/constant-theme';
import useSocket from 'hooks/useSocket';

const ControlPanel = () => {
    const { usersCount } = useSocket();

    // dashboard data
    const initialdata = useLoaderData();
    const [subscriptions, setSubscriptions] = useState(initialdata.members);
    const [movies, setMovies] = useState(initialdata.movies);
    const [users, setUsers] = useState(initialdata.users);
    const [popular_movies, setPopular_movies] = useState(initialdata.popular_movies);
    const [yearlySubscriptionsData, setYearlySubscriptionsData] = useState(initialdata.yearlySubscriptionsData);    

    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <AmountMoviesCard isLoading={isLoading} movies={movies} />
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <TotalSubscriptionsCard isLoading={isLoading} popular_movies={popular_movies} />
                    </Grid>
                    <Grid item lg={4} md={12} sm={12} xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                <UsersOnlineCard isLoading={isLoading} usersCount={usersCount} />
                            </Grid>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                <MembersAmountCard isLoading={isLoading} members={initialdata.members} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} md={7} lg={8}>
                        <TotalSubscriptionBarChart isLoading={isLoading} yearlySubscriptionsData={yearlySubscriptionsData} />
                    </Grid>
                    <Grid item xs={12} md={5} lg={4}>
                        <PopularMoviesCard isLoading={isLoading} popular_movies={popular_movies} />
                    </Grid>
                </Grid>
            </Grid>
            {/* <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} md={4}>
                        <GenresPieChart isLoading={isLoading} />
                    </Grid>
                </Grid>
            </Grid> */}
        </Grid>
    );
};

export default ControlPanel;
