import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Button, CardActions, CardContent, CardMedia, Divider, Grid, Menu, MenuItem, Typography, LinearProgress, Autocomplete, TextField } from '@mui/material';

// internal imports
import SubCard from 'components/cards/SubCard';
import MemberDetailsRecommended from 'components/cards/Skeleton/MemberDetailsRecommended';
import useConfig from 'hooks/useConfig';
import { gridSpacing } from 'utils/constant-theme';

// assets
import { IconMail, IconBuildingCommunity } from '@tabler/icons-react';

const MembersDetails = ({ isLoading, member }) => {
    const theme = useTheme();

    const { borderRadius } = useConfig();

    useEffect(() => {

    }, []);

    return (
        <>
            {isLoading ? (
                <MemberDetailsRecommended />
            ) : (
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
                                        {member?.email}
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
                                        {member?.city}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </SubCard>
            )}
        </>
    );
};

MembersDetails.propTypes = {
    isLoading: PropTypes.bool,
    member: PropTypes.object,
};

export default MembersDetails;
