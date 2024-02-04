import { lazy } from 'react';

// Internal imports
import MainLayout from 'layout/MainLayout';
import AuthGuard from './route-guard/AuthGuard';
import Loadable from 'components/Loadable';

import { loader as moviesLoader, movieLoader } from 'store/slices/movie';
import { loader as membersLoader, memberLoader } from 'store/slices/member';
import { loader as usersLoader } from 'store/slices/user';
import { loader as dashboardLoader } from 'store/slices/dashboard';

// socket provider [Context]
import { SocketProvider } from 'contexts/SocketContext';

// dashboard routing
const DashboardControlPanel = Loadable(lazy(() => import('views/dashboard/ControlPanel')));

// cinema - movies routing
const CinemaMoviesMain = Loadable(lazy(() => import('views/cinema/movies/MoviesMain')));
const CinemaMovieDetails = Loadable(lazy(() => import('views/cinema/movies/MovieDetails')));

// cinema - subscriptions routing
const CinemaSubscriptionsMain = Loadable(lazy(() => import('views/cinema/subscriptions/SubscriptionsMain')));
const CinemaMemberProfile = Loadable(lazy(() => import('views/cinema/subscriptions/MemberDetails')));

// cinema - chat
const CinemaChat = Loadable(lazy(() => import('views/cinema/chat')));

// management - users routing
const UsersManagementMain = Loadable(lazy(() => import('views/UsersManagement/UsersManagementMain')));
const UsersAddEditUser = Loadable(lazy(() => import('views/UsersManagement/AddEditUser')));

const MainRoutes = {
    path: '/',
    element: (
        <SocketProvider>
            <AuthGuard>
                <MainLayout />
            </AuthGuard>
        </SocketProvider>
    ),
    children: [
        {
            path: '/',
            element: <DashboardControlPanel />,
            loader: dashboardLoader
        },
        {
            path: '/dashboard/control-panel',
            element: <DashboardControlPanel />,
            loader: dashboardLoader
        },
        {
            path: '/cinema/movies',
            element: <CinemaMoviesMain />,
            loader: moviesLoader
        },
        {
            path: '/cinema/movies/movie-details/:id',
            element: <CinemaMovieDetails />,
            // loader: movieLoader
        },
        {
            path: '/cinema/subscriptions',
            element: <CinemaSubscriptionsMain />,
            loader: membersLoader
        },
        {
            path: '/cinema/subscriptions/member-profile/:id',
            element: <CinemaMemberProfile />,
            loader: memberLoader
        },
        {
            path: '/management/users',
            element: <UsersManagementMain />,
            loader: usersLoader
        },
        {
            path: '/management/users/add-user',
            element: <UsersAddEditUser />,
        },
        {
            path: '/management/users/add-user/:id',
            element: <UsersAddEditUser />,
        },
        {
            path: '/cinema/chat',
            element: <CinemaChat />,
        },

    ]
}

export default MainRoutes;

