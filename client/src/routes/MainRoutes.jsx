import { lazy } from 'react';

// Internal imports
import MainLayout from 'layout/MainLayout';
import AuthGuard from './route-guard/AuthGuard';
import Loadable from 'components/Loadable';

import { loader as moviesLoader, movieLoader } from 'store/slices/movie';
import { loader as membersLoader, memberLoader } from 'store/slices/member';

// dashboard routing
const PocMembersPage = Loadable(lazy(() => import('views/poc-members-page/PocMembersPage')));

// cinema - movies routing
const CinemaMoviesMain = Loadable(lazy(() => import('views/cinema/movies/MoviesMain')));
const CinemaMovieDetails = Loadable(lazy(() => import('views/cinema/movies/MovieDetails')));

// cinema - subscriptions routing
const CinemaSubscriptionsMain = Loadable(lazy(() => import('views/cinema/subscriptions/SubscriptionsMain')));
const CinemaMemberProfile = Loadable(lazy(() => import('views/cinema/subscriptions/MemberDetails')));

const MainRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: '/',
            element: <PocMembersPage />,
            loader: membersLoader,
        },
        {
            path: '/members-page',
            element: <PocMembersPage />,
            loader: membersLoader,
        },
        {
            path: '/cinema/movies',
            element: <CinemaMoviesMain />,
            loader: moviesLoader,
        },
        {
            path: '/cinema/movies/movie-details/:id',
            element: <CinemaMovieDetails />,
            // loader: movieLoader,
        },
        {
            path: '/cinema/subscriptions',
            element: <CinemaSubscriptionsMain />,
            loader: membersLoader,
        },
        {
            path: '/cinema/subscriptions/member-profile/:id',
            element: <CinemaMemberProfile />,
            loader: memberLoader,
        }
        
    ]
}

export default MainRoutes;

