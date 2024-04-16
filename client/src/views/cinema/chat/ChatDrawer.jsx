import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { Box, Drawer, Grid, IconButton, InputAdornment, Menu, MenuItem, OutlinedInput, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';


// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// internal imports
import UserList from './UserList';
import AvatarStatus from './AvatarStatus';
import UserAvatar from './UserAvatar';
import useAuth from 'hooks/useAuth';
import useSocket from 'hooks/useSocket';
import MainCard from 'components/cards/MainCard';
import { appDrawerWidth as drawerWidth, gridSpacing } from 'utils/constant-theme';

// assets
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useConfig from 'hooks/useConfig';

const ChatDrawer = ({ handleDrawerOpen, openChatDrawer, alterUserDisplay, messageSocket, onlineUsers, setTypingStatus }) => {
    const theme = useTheme();

    // userLogin
    const { user: userLogin } = useAuth();
    const { socket } = useSocket();
    const { borderRadius } = useConfig();
    const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));

    // show menu to set current user status
    const [anchorEl, setAnchorEl] = useState();
    const handleClickRightMenu = (event) => {
        setAnchorEl(event?.currentTarget);
    };

    const handleCloseRightMenu = () => {
        setAnchorEl(null);
    };

    // set user status on status menu click
    const [status, setStatus] = useState('online');
    const handleRightMenuItemClick = (userStatus) => () => {
        switch (userStatus) {
            case 'available':
                socket?.emit('availableInSystem', { username: userLogin.username });
                break;
            case 'offline':
                socket?.emit('offlineInSystem', { username: userLogin.username });
                break;
            default: // online
                socket?.emit('onlineChat', { username: userLogin.username });
                break;
        }
        setStatus(userStatus);
        handleCloseRightMenu();
    };

    const drawerBG = theme.palette.mode === 'dark' ? 'dark.main' : 'grey.50';

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                zIndex: { xs: 1100, lg: 0 },
                '& .MuiDrawer-paper': {
                    height: matchDownLG ? '100%' : 'auto',
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    position: 'relative',
                    border: 'none',
                    borderRadius: matchDownLG ? 'none' : `${borderRadius}px`
                }
            }}
            variant={matchDownLG ? 'temporary' : 'persistent'}
            anchor="left"
            open={openChatDrawer}
            ModalProps={{ keepMounted: true }}
            onClose={handleDrawerOpen}
        >
            {openChatDrawer && (
                <MainCard
                    sx={{
                        bgcolor: matchDownLG ? 'transparent' : drawerBG
                    }}
                    border={!matchDownLG}
                    content={false}
                >
                    <Box sx={{ p: 3, pb: 2 }}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <Grid container spacing={2} alignItems="center" sx={{ flexWrap: 'nowrap' }}>
                                    <Grid item>
                                        <UserAvatar user={{ online_status: status, avatar: userLogin?.image, name: userLogin?.firstName + ' ' + userLogin?.lastName }} />
                                    </Grid>
                                    <Grid item xs zeroMinWidth>
                                        <Typography align="left" variant="h4">
                                            {userLogin?.firstName + ' ' + userLogin?.lastName}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <IconButton onClick={handleClickRightMenu} size="large" aria-label="user status options">
                                            <ExpandMoreIcon />
                                        </IconButton>
                                        <Menu
                                            id="simple-menu"
                                            anchorEl={anchorEl}
                                            keepMounted
                                            open={Boolean(anchorEl)}
                                            onClose={handleCloseRightMenu}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right'
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right'
                                            }}
                                        >
                                            <MenuItem onClick={handleRightMenuItemClick('online')}>
                                                <AvatarStatus status="online" mr={1} />
                                                Online
                                            </MenuItem>
                                            <MenuItem onClick={handleRightMenuItemClick('available')}>
                                                <AvatarStatus status="available" mr={1} />
                                                Available
                                            </MenuItem>
                                            <MenuItem onClick={handleRightMenuItemClick('offline')}>
                                                <AvatarStatus status="offline" mr={1} />
                                                Offline
                                            </MenuItem>
                                        </Menu>
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/* <Grid item xs={12}>
                                <OutlinedInput
                                    fullWidth
                                    id="input-search-header"
                                    placeholder="Search Mail"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <SearchTwoToneIcon fontSize="small" />
                                        </InputAdornment>
                                    }
                                />
                            </Grid> */}
                        </Grid>
                    </Box>
                    <PerfectScrollbar
                        style={{
                            overflowX: 'hidden',
                            height: matchDownLG ? 'calc(100vh - 190px)' : 'calc(100vh - 445px)',
                            minHeight: matchDownLG ? 0 : 520
                        }}
                    >
                        <Box sx={{ p: 3, pt: 0 }}>
                            <UserList alterUserDisplay={alterUserDisplay} messageSocket={messageSocket} onlineUsers={onlineUsers} setTypingStatus={setTypingStatus} />
                        </Box>
                    </PerfectScrollbar>
                </MainCard>
            )}
        </Drawer>
    );
};

ChatDrawer.propTypes = {
    handleDrawerOpen: PropTypes.func,
    openChatDrawer: PropTypes.bool,
    alterUserDisplay: PropTypes.func,
    messageSocket: PropTypes.object,
    onlineUsers: PropTypes.array,
    setTypingStatus: PropTypes.func
};

export default ChatDrawer;
