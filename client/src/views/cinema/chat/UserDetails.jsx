import PropTypes from 'prop-types';
import { useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Card, CardContent, CardMedia, Divider, Grid, Typography } from '@mui/material';

// internal imports
import AvatarStatus from './AvatarStatus';
import SubCard from 'components/cards/SubCard';
import { gridSpacing } from 'utils/constant-theme';
import { getImageUrl, ImagePath } from 'utils/getImageUrl';

// third-party
import { format } from 'date-fns';

// assets
import PinDropTwoToneIcon from '@mui/icons-material/PinDropTwoTone';
import PhoneTwoToneIcon from '@mui/icons-material/PhoneTwoTone';
import EmailTwoToneIcon from '@mui/icons-material/EmailTwoTone';
import PersonIcon from '@mui/icons-material/Person';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import DateRangeIcon from '@mui/icons-material/DateRange';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PunchClockIcon from '@mui/icons-material/PunchClock';

import images1 from 'assets/images/pages/img-catalog1.png';
import images2 from 'assets/images/pages/img-catalog2.png';
import images3 from 'assets/images/pages/img-catalog3.png';

const UserDetails = ({ user }) => {
    const theme = useTheme();

    return (
        <Grid container spacing={gridSpacing} sx={{ width: '100%', maxWidth: 300 }}>
            <Grid item xs={12}>
                <Card>
                    <CardContent
                        sx={{
                            textAlign: 'center',
                            background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light
                        }}
                    >
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Avatar
                                    alt={user.user?.firstName + ' ' + user.user?.lastName}
                                    src={user.user?.image}
                                    sx={{
                                        m: '0 auto',
                                        width: 130,
                                        height: 130,
                                        border: '1px solid',
                                        borderColor: theme.palette.primary.main,
                                        p: 1,
                                        bgcolor: 'transparent'
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <AvatarStatus status={user.online_status} />
                                <Typography variant="caption" component="div">
                                    {user?.online_status.replaceAll('_', ' ')}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h5" component="div">
                                    {user.user?.firstName + ' ' + user.user?.lastName}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2" component="div">
                                {user.username}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <SubCard
                    sx={{
                        background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50]
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h5" component="div">
                                Information
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <Typography variant="body2">
                                        <AccessibilityIcon sx={{ verticalAlign: 'sub', fontSize: '1.125rem', mr: 0.625 }} />
                                        published: {format(new Date(user.user.published), 'E, MMM d yyyy')}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2">
                                        <PunchClockIcon sx={{ verticalAlign: 'sub', fontSize: '1.125rem', mr: 0.625 }} />
                                        {user.user.sessionTimeOut} {'minutes a user can work'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </SubCard>
            </Grid>
        </Grid>
    );
};

UserDetails.propTypes = {
    user: PropTypes.object
};

export default UserDetails;
