import { lazy } from 'react';

// Internal imports
import MinimalLayout from 'layout/MinimalLayout';
import GuestGuard from './route-guard/GuestGuard';
import Loadable from 'components/Loadable';

// login routing
const AuthLogin = Loadable(lazy(() => import('views/pages/authentication/Login')));
const AuthRegister = Loadable(lazy(() => import('views/pages/authentication/Register')));

const LoginRoutes = {
    path: '/',
    element: (
        <GuestGuard>
            <MinimalLayout />
        </GuestGuard>
    ),
    children: [
        {
            path: '/login',
            element: <AuthLogin />
        },
        {
            path: '/register',
            element: <AuthRegister />
        }
    ]
}

export default LoginRoutes;
