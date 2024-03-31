import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Button, CardActions, CardContent, CardMedia, Divider, Grid, Menu, MenuItem, Typography, LinearProgress, Autocomplete, TextField } from '@mui/material';

// internal imports
import SubCard from 'components/cards/SubCard';
import MemberLastSubscriptionsRecommended from 'components/cards/Skeleton/MemberLastSubscriptionsRecommended';
import useConfig from 'hooks/useConfig';
import { gridSpacing } from 'utils/constant-theme';

// assets
import { IconMail, IconBuildingCommunity } from '@tabler/icons-react';

const LastMembersSubscriptions = ({ isLoading, lastSubscriptions }) => {
    const theme = useTheme();

    const { borderRadius } = useConfig();

    useEffect(() => {

    }, []);

    return (
        <>
            {isLoading ? (
                <MemberLastSubscriptionsRecommended />
            ) : (
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
            )}
        </>
    );
};

LastMembersSubscriptions.propTypes = {
    isLoading: PropTypes.bool,
    lastSubscriptions: PropTypes.array,
};

export default LastMembersSubscriptions;
