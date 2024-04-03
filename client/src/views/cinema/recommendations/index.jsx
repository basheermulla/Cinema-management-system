
import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLoaderData, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Autocomplete, Avatar, Box, Button, CardActions, CardContent, CardMedia, Divider, Grid, InputAdornment, TextField, Typography } from '@mui/material';

// internal imports
import MainCard from 'components/cards/MainCard';
import SubCard from 'components/cards/SubCard';
import SkeletonRecommendedPlaceholder from 'components/cards/Skeleton/RecommendedPlaceholder';
import SelectedMember from './SelectedMember';
import MembersDetails from './MembersDetails';
import LastMembersSubscriptions from './LastMembersSubscriptions';
import RelatedMovies from './RelatedMovies';
import AddSubscriptionByMember from '../movies/MoviesMain/AddSubscriptionByMember';
import { createSubscription } from 'store/slices/member';
import { gridSpacing } from 'utils/constant-theme';
import useConfig from 'hooks/useConfig';

// assets
import Avatar1 from 'assets/images/users/avatar-1.png';
import { IconMail, IconBuildingCommunity } from '@tabler/icons-react';

const activeSX = {
    width: 16,
    height: 16,
    verticalAlign: 'sub',
    color: 'success.main'
};

const iconSX = {
    fontSize: '0.875rem',
    mr: 0.25,
    verticalAlign: 'sub'
};

// table data
function createData(members) {
    return members?.map((member) => { return { label: member.name, _id: member._id } })
}

const RecommendationMain = () => {
    const theme = useTheme();
    const { borderRadius } = useConfig();

    // member include subscriptions data & movies
    const initialdata = useLoaderData();
    const [members, setMembers] = useState(initialdata.members);
    const [movies, setMovies] = useState(initialdata.movies);

    const [member, setMember] = useState({});
    const [lastSubscriptions, setLastSubscriptions] = useState([]);
    const [optionsFilms, setOptionsFilms] = useState([]);

    useEffect(() => {
        if (movies) {
            setMember(members[0]);
            setLastSubscriptions(members[0].relatedMovie.slice(0, 3));
        }
    }, [movies]);

    const handleAutocomplete = (new_member) => {
        const checked_member = members.find((member) => member._id === new_member._id);
        setMember(checked_member);
        setLastSubscriptions(checked_member.relatedMovie.slice(0, 3));
    }
    useEffect(() => {
        const data = createData(members);
        setOptionsFilms(data);
    }, [movies]);

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

    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    const relatedProducts = useMemo(() => (
        <RelatedMovies
            id={member?._id}
            isLoading={isLoading}
            handleClickOpenSubscribeDialog={handleClickOpenSubscribeDialog}
        />
    ), [member?._id]);

    return (
        <>
            <Grid container alignItems="center" justifyContent="center" spacing={0}>
                <Grid item xs={12}>
                    <MainCard>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12} md={6} lg={4}>
                                <SelectedMember
                                    isLoading={isLoading}
                                    member={member}
                                    optionsFilms={optionsFilms}
                                    handleAutocomplete={handleAutocomplete}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} lg={4}>
                                <MembersDetails isLoading={isLoading} member={member} />
                            </Grid>
                            {lastSubscriptions && lastSubscriptions[0]?.date && (
                                <Grid item xs={12} md={6} lg={4}>
                                    <LastMembersSubscriptions lastSubscriptions={lastSubscriptions} />
                                </Grid>)}

                        </Grid>
                    </MainCard>
                </Grid>
                <Grid item xs={11}>
                    {relatedProducts}
                </Grid>
                <AddSubscriptionByMember
                    open={openSubscribeDialog}
                    movieId={movieId}
                    handleCloseSubscribeDialog={handleCloseSubscribeDialog}
                    addSubscriptionByMember={addSubscriptionByMember}
                    members={members}
                />
            </Grid>
        </>
    );
};

export default RecommendationMain;