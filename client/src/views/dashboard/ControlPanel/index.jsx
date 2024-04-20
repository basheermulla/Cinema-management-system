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
import useAuth from 'hooks/useAuth';
import { getMoviesDataForDashboard } from "store/slices/dashboard";
import Loader from 'components/Loader';

const ControlPanel = () => {
    const { user } = useAuth();
    const { usersCount, socket } = useSocket();

    // dashboard initial data - get [yearlyData, countMember, countSubscription]
    const initialdata = useLoaderData();
    const [yearlySubscriptionsData, setYearlySubscriptionsData] = useState(initialdata.yearlyData);
    const [amountOfMembers, setAmountOfMembers] = useState(initialdata.countMember);
    const [amountOfSubscription, setAmountOfSubscription] = useState(initialdata.countSubscription);

    const [popular_movies, setPopular_movies] = useState(initialdata.popular_movies);
    const [amountOfMovies, setAmountOfMovies] = useState(0);

    useEffect(() => {
        // Function to get secondary data for a dashboard [countMember, countSubscription, yearlyData]
        const feachData = async () => {
            try {
                const response = await getMoviesDataForDashboard();
                console.log(response);
                setPopular_movies(response.popular_movies);
                setAmountOfMovies(response.countMovie)
                console.log(response);
            } catch (error) {
                console.error('Error fetching members:', error);
            }
        };

        feachData();

    }, []);

    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    //sends the username and socket ID to the Node.js server
    // useEffect(() => {
    //     socket?.emit('newUser', { username: user.username, socketID: socket.id });
    // }, []);

    //=========================================================================================================================================
    //==                                               ✔️▶️🎬 Loading Page 🎬▶️✔️                                                         ==
    //=========================================================================================================================================
    if (isLoading) return <Loader />;

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <AmountMoviesCard isLoading={isLoading} amountOfMovies={amountOfMovies} />
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <TotalSubscriptionsCard isLoading={isLoading} amountOfSubscription={amountOfSubscription} />
                    </Grid>
                    <Grid item lg={4} md={12} sm={12} xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                <UsersOnlineCard isLoading={isLoading} usersCount={usersCount} />
                            </Grid>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                <MembersAmountCard isLoading={isLoading} amountOfMembers={amountOfMembers} />
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
                        <PopularMoviesCard isLoading={isLoading} popular_movies={popular_movies} amountOfSubscription={amountOfSubscription} />
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
