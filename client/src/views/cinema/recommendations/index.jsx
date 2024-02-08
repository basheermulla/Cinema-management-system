
import { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useLoaderData, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Autocomplete, Avatar, Box, Button, CardActions, CardContent, CardMedia, Divider, Grid, InputAdornment, TextField, Typography } from '@mui/material';

// internal imports
import MainCard from 'components/cards/MainCard';
import SubCard from 'components/cards/SubCard';
import SecondaryAction from 'components/cards/CardSecondaryAction';
import AnimateButton from 'components/extended/AnimateButton';
import RelatedMovies from './RelatedMovies';
import { loader, createSubscription, updateMember } from 'store/slices/member';
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
    return members.map((member) => { return { label: member.name, _id: member._id } })
}

const RecommendationMain = () => {
    const theme = useTheme();
    const { borderRadius } = useConfig();

    // member include subscriptions data & movies
    const initialdata = useLoaderData();
    const [members, setMembers] = useState(initialdata.members);
    const [movies, setMovies] = useState(initialdata.movies);

    const [member, setMember] = useState(members[0]);
    const [lastSubscriptions, setLastSubscriptions] = useState(members[0].relatedMovie.slice(0, 3));
    const [optionsFilms, setOptionsFilms] = useState([]);

    const handleAutocomplete = (new_member) => {
        console.log(new_member);
        const checked_member = members.find((member) => member._id === new_member._id);
        setMember(checked_member);
        setLastSubscriptions(checked_member.relatedMovie.slice(0, 3));
    }
    useEffect(() => {
        const data = createData(members);
        setOptionsFilms(data);
    }, [movies]);

    const relatedProducts = useMemo(() => <RelatedMovies id={member._id} />, [member._id]);

    return (
        <Grid container alignItems="center" justifyContent="center" spacing={0}>
            <Grid item xs={12}>

                <MainCard>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} md={6} lg={4}>
                            <SubCard title="Member">
                                <Grid container direction="column" spacing={3}>
                                    <Grid item>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Avatar alt="User 1" src={member.image} sx={{ width: 75, height: 75, margin: '0 auto' }} />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="h5" align="center">
                                                    {member.name}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="subtitle2" align="left" mb={0.5}>
                                            Choose member:
                                        </Typography>
                                        <Autocomplete
                                            disableClearable
                                            onChange={(e, value) => {
                                                handleAutocomplete(value)
                                            }}
                                            defaultChecked={{ label: member.name, _id: member._id }}
                                            options={optionsFilms}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => <TextField {...params} label="" />}
                                        />
                                    </Grid>
                                </Grid>
                            </SubCard>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <SubCard title="Member's Details" contentSX={{ textAlign: 'center' }}>
                                <Grid container spacing={2} alignItems="center" justifyContent="center" mb={4}>
                                    <Grid item>
                                        <Typography
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                color: theme.palette.secondary.main,
                                                borderRadius: '12px',
                                                padding: 1,
                                                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : '#c0c9e9'
                                            }}
                                        >
                                            <IconMail stroke={2} />
                                        </Typography>
                                    </Grid>
                                    <Grid item xs zeroMinWidth>
                                        <Grid container spacing={1}>
                                            <Grid item xs zeroMinWidth>
                                                <Typography align="left" variant="h5">
                                                    {member.email}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    <Grid item>
                                        <Typography
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                color: theme.palette.primary.main,
                                                borderRadius: '12px',
                                                padding: 1,
                                                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : '#c0c9e9'
                                            }}
                                        >
                                            <IconBuildingCommunity stroke={2} />
                                        </Typography>
                                    </Grid>
                                    <Grid item xs zeroMinWidth>
                                        <Grid container spacing={1}>
                                            <Grid item xs zeroMinWidth>
                                                <Typography align="left" variant="h5">
                                                    {member.city}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                            </SubCard>
                        </Grid>
                        {lastSubscriptions && lastSubscriptions[0].date && <Grid item xs={12} md={6} lg={4}>
                            <SubCard title="Last Member's Subscriptions" contentSX={{ textAlign: 'center' }}>
                                <Grid container spacing={gridSpacing} alignItems="center">
                                    {lastSubscriptions.map((subscription, index) => (
                                        <Grid item xs={12} key={index}>
                                            <Grid container spacing={2}>
                                                <Grid item>
                                                    <CardMedia
                                                        component="img"
                                                        image={subscription.movie?.image.medium}
                                                        sx={{ borderRadius: `${borderRadius}px`, width: 45, height: 50 }}
                                                        alt="external image"
                                                    />
                                                </Grid>
                                                <Grid item xs zeroMinWidth>
                                                    <Typography align="left" component="div" variant="subtitle1">
                                                        {subscription.movie?.name}
                                                    </Typography>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs zeroMinWidth>
                                                            <Typography align="left" component="div" variant="subtitle2">
                                                                {new Date(subscription.movie?.premiered).toLocaleDateString()}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <Typography align="left" component="div" variant="caption">
                                                                {new Date(subscription.date).toLocaleDateString()}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    ))}
                                </Grid>
                            </SubCard>
                        </Grid>}

                    </Grid>
                </MainCard>
            </Grid>
            <Grid item xs={11}>
                {relatedProducts}
            </Grid>
        </Grid>
    );
};

export default RecommendationMain;