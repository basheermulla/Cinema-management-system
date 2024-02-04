import { useEffect, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { AppBar, Box, Container, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';

// project imports
import Header from './Header';
import Sidebar from './Sidebar';
import HorizontalBar from './HorizontalBar';
import Breadcrumbs from 'components/extended/Breadcrumbs';

import LAYOUT_CONST from 'utils/constant-layout';
import useConfig from 'hooks/useConfig';
import { drawerWidth } from 'utils/constant-theme';
import { openDrawer, openChat } from 'store/slices/menu';
import { useDispatch, useSelector } from 'store/index';
import useSocket from 'hooks/useSocket';
import useAuth from 'hooks/useAuth';

// styles
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open, layout }) => ({
    ...theme.typography.mainContent,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    ...(!open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.shorter + 200
        }),
        [theme.breakpoints.up('md')]: {
            marginLeft: layout === LAYOUT_CONST.VERTICAL_LAYOUT ? -(drawerWidth - 72) : '20px',
            width: `calc(100% - ${drawerWidth}px)`,
            marginTop: layout === LAYOUT_CONST.HORIZONTAL_LAYOUT ? 135 : 88
        }
    }),
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.shorter + 200
        }),
        marginLeft: layout === LAYOUT_CONST.HORIZONTAL_LAYOUT ? '20px' : 0,
        marginTop: layout === LAYOUT_CONST.HORIZONTAL_LAYOUT ? 135 : 88,
        width: `calc(100% - ${drawerWidth}px)`,
        [theme.breakpoints.up('md')]: {
            marginTop: layout === LAYOUT_CONST.HORIZONTAL_LAYOUT ? 135 : 88
        }
    }),
    [theme.breakpoints.down('md')]: {
        marginLeft: '20px',
        padding: '16px',
        marginTop: 88,
        ...(!open && {
            width: `calc(100% - ${drawerWidth}px)`
        })
    },
    [theme.breakpoints.down('sm')]: {
        marginLeft: '10px',
        marginRight: '10px',
        padding: '16px',
        marginTop: 88,
        ...(!open && {
            width: `calc(100% - ${drawerWidth}px)`
        })
    }
}));

const MainLayout = () => {
    const theme = useTheme();

    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

    const dispatch = useDispatch();
    const { drawerOpen, chatOpen, selectedItem } = useSelector((state) => state.menu);
    const { drawerType, container, layout } = useConfig();

    // userLogin
    const { user: userLogin } = useAuth();

    const { pathname } = useLocation();
    const { socket } = useSocket();

    useEffect(() => {
        if (drawerType === LAYOUT_CONST.DEFAULT_DRAWER) {
            dispatch(openDrawer(true));
        } else {
            dispatch(openDrawer(false));
        }
    }, [drawerType]);

    useEffect(() => {
        if (drawerType === LAYOUT_CONST.DEFAULT_DRAWER) {
            dispatch(openDrawer(true));
        }
    }, []);

    //------------------------------------------------------
    // useEffect -> Emit userLeaveChat event               -
    //------------------------------------------------------
    useEffect(() => {
        console.log('pathname = ', pathname);
        console.log('selectedItem = ', selectedItem);
        console.log('chatOpen = ', chatOpen);
        if (pathname === '/cinema/chat') {
            console.log('Here we will dispatch open chat');
            dispatch(openChat(true));
        } else if (chatOpen) {
            console.log('Leave chat now ');
            dispatch(openChat(false));
            socket?.emit('availableInSystem', { username: userLogin.username });
        }
    }, [pathname]);

    useEffect(() => {
        if (matchDownMd) {
            dispatch(openDrawer(true));
        }
    }, [matchDownMd]);

    const condition = layout === LAYOUT_CONST.HORIZONTAL_LAYOUT && !matchDownMd;

    const header = useMemo(
        () => (
            <Toolbar sx={{ p: condition ? '10px' : '16px' }}>
                <Header />
            </Toolbar>
        ),
        [layout, matchDownMd]
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            {/* header */}
            <AppBar enableColorOnDark position="fixed" color="inherit" elevation={0} sx={{ bgcolor: theme.palette.background.default }}>
                {header}
            </AppBar>

            {/* horizontal menu-list bar */}
            {layout === LAYOUT_CONST.HORIZONTAL_LAYOUT && !matchDownMd && <HorizontalBar />}

            {/* drawer */}
            {(layout === LAYOUT_CONST.VERTICAL_LAYOUT || matchDownMd) && <Sidebar />}

            {/* main content */}
            <Main theme={theme} open={drawerOpen} layout={layout}>
                <Container maxWidth={container ? 'lg' : false} {...(!container && { sx: { px: { xs: 0 } } })}>
                    {/* breadcrumb */}
                    <Breadcrumbs />
                    <Outlet />
                </Container>
            </Main>
        </Box>
    )
};

export default MainLayout;