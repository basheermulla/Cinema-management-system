import { lazy } from 'react';

// Internal imports
import MainLayout from 'layout/MainLayout';
import AuthGuard from './route-guard/AuthGuard';
import Loadable from 'components/Loadable';

import { loader as moviesLoader, movieLoader } from 'store/slices/movie';

// dashboard routing
const PocMembersPage = Loadable(lazy(() => import('views/poc-members-page/PocMembersPage')));

// cinema - movies routing
const CinemaMoviesMain = Loadable(lazy(() => import('views/cinema/movies/MoviesMain')));
const CinemaMovieDetails = Loadable(lazy(() => import('views/cinema/movies/MovieDetails')));

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
            element: <PocMembersPage />
        },
        {
            path: '/members-page',
            element: <PocMembersPage />
        },
        {
            path: '/cinema/movies',
            element: <CinemaMoviesMain />,
            loader: moviesLoader,
        },        
        {
            path: '/cinema/movies/:add',
            element: <CinemaMoviesMain />,
            loader: moviesLoader,
        },
        {
            path: '/cinema/movies/movie-details/:id',
            element: <CinemaMovieDetails />,
            loader: movieLoader,
        }
        
    ]
}

export default MainRoutes;

