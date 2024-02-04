import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar, Box, Chip, ClickAwayListener, Divider, Grid, List, ListItemButton, ListItemIcon, ListItemText, Paper,
    Popper, Stack, Typography, Container
} from '@mui/material';

// third-party
import { FormattedMessage } from 'react-intl';
import PerfectScrollbar from 'react-perfect-scrollbar';

// internal imports
import MainCard from 'components/cards/MainCard';
import Transitions from 'components/extended/Transitions';
import useAuth from 'hooks/useAuth';
import useSocket from 'hooks/useSocket';

// assets
import { IconLogout, IconSettings, IconUser } from '@tabler/icons-react';
import useConfig from 'hooks/useConfig';

const ProfileSection = () => {
    const theme = useTheme();
    const { borderRadius } = useConfig();
    const navigate = useNavigate();
    const { socket } = useSocket();

    const [sdm, setSdm] = useState(true);
    const [value, setValue] = useState('');
    const [notification, setNotification] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const { logout, user } = useAuth();
    const [open, setOpen] = useState(false);
    /**
     * anchorRef is used on different components and specifying one type leads to other components throwing an error
     * */
    const anchorRef = useRef(null);
    const handleLogout = async () => {
        try {
            socket?.emit('offlineInSystem', { username: user.username });
            await logout();
        } catch (err) {
            console.error(err);
        }
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };
    const handleListItemClick = (event, index, route = '') => {
        setSelectedIndex(index);
        handleClose(event);

        if (route && route !== '') {
            navigate(route);
        }
    };
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);


    return (
        <>
            <Chip
                sx={{
                    height: '48px',
                    alignItems: 'center',
                    borderRadius: '27px',
                    transition: 'all .2s ease-in-out',
                    borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light,
                    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light,
                    '&[aria-controls="menu-list-grow"], &:hover': {
                        borderColor: theme.palette.primary.main,
                        background: `${theme.palette.primary.main}!important`,
                        color: theme.palette.primary.light,
                        '& svg': {
                            stroke: theme.palette.primary.light
                        }
                    },
                    '& .MuiChip-label': {
                        lineHeight: 0
                    }
                }}
                icon={
                    <Avatar
                        src={user?.image}
                        sx={{
                            ...theme.typography.mediumAvatar,
                            margin: '8px 0 8px 8px !important',
                            cursor: 'pointer'
                        }}
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        color="inherit"
                        alt="user-account"
                    />
                }
                label={<IconSettings stroke={1.5} size="24px" color={theme.palette.primary.main} />}
                variant="outlined"
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                color="primary"
            />

            <Popper
                placement="bottom"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                modifiers={[
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 14]
                        }
                    }
                ]}
            >
                {
                    ({ TransitionProps }) => (
                        <ClickAwayListener onClickAway={handleClose}>
                            <Transitions in={open} {...TransitionProps}>
                                {/* <Container sx={{ height: 'auto' }}> */}
                                {
                                    open && (
                                        <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]} sx={{ maxHeight: '220px' }}>
                                            <Box sx={{ p: 2, pb: 0 }}>
                                                <Stack>
                                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                                        <Typography variant="h4" sx={{ fontWeight: 400 }}>Hello,</Typography>
                                                        <Typography component="span" variant="h4">
                                                            {user?.firstName + ' ' + user?.lastName}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                                <Divider />
                                            </Box>
                                            <PerfectScrollbar
                                                style={{
                                                    height: '100%',
                                                    maxHeight: 'calc(100vh - 250px)',
                                                    overflowX: 'hidden'
                                                }}
                                            >
                                                <Box sx={{ p: 2, pt: 0 }}>
                                                    <List
                                                        component="nav"
                                                        sx={{
                                                            width: '100%',
                                                            maxWidth: 350,
                                                            minWidth: 300,
                                                            backgroundColor: theme.palette.background.paper,
                                                            borderRadius: '10px',
                                                            [theme.breakpoints.down('md')]: {
                                                                minWidth: '100%'
                                                            },
                                                            '& .MuiListItemButton-root': {
                                                                mt: 0.5
                                                            }
                                                        }}
                                                    >
                                                        <ListItemButton
                                                            sx={{ borderRadius: `${borderRadius}px` }}
                                                            selected={selectedIndex === 0}
                                                            onClick={(event) => handleListItemClick(event, 0, '/user/account-profile/profile1')}
                                                        >
                                                            <ListItemIcon>
                                                                <IconSettings stroke={1.5} size="20px" />
                                                            </ListItemIcon>
                                                            <ListItemText
                                                                primary={
                                                                    <Typography variant="body2">
                                                                        <FormattedMessage id="account-settings" />
                                                                    </Typography>
                                                                }
                                                            />
                                                        </ListItemButton>
                                                        <ListItemButton
                                                            sx={{ borderRadius: `${borderRadius}px` }}
                                                            selected={selectedIndex === 1}
                                                            onClick={(event) => handleListItemClick(event, 1, '/user/social-profile/posts')}
                                                        >
                                                            <ListItemIcon>
                                                                <IconUser stroke={1.5} size="20px" />
                                                            </ListItemIcon>
                                                            <ListItemText
                                                                primary={
                                                                    <Grid container spacing={1} justifyContent="space-between">
                                                                        <Grid item>
                                                                            <Typography variant="body2">
                                                                                <FormattedMessage id="social-profile" />
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid item>
                                                                            <Chip
                                                                                label="02"
                                                                                size="small"
                                                                                color="warning"
                                                                                sx={{ '& .MuiChip-label': { mt: 0.25 } }}
                                                                            />
                                                                        </Grid>
                                                                    </Grid>
                                                                }
                                                            />
                                                        </ListItemButton>
                                                        <ListItemButton
                                                            sx={{ borderRadius: `${borderRadius}px` }}
                                                            selected={selectedIndex === 4}
                                                            onClick={handleLogout}
                                                        >
                                                            <ListItemIcon>
                                                                <IconLogout stroke={1.5} size="20px" />
                                                            </ListItemIcon>
                                                            <ListItemText
                                                                primary={
                                                                    <Typography variant="body2">
                                                                        <FormattedMessage id="logout" />
                                                                    </Typography>
                                                                }
                                                            />
                                                        </ListItemButton>
                                                    </List>
                                                </Box>
                                            </PerfectScrollbar>
                                        </MainCard>
                                    )
                                }
                                {/* </Container> */}
                            </Transitions>
                        </ClickAwayListener>
                    )
                }
            </Popper>
        </>
    )
}

export default ProfileSection