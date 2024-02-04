import { lazy } from 'react';

// Internal imports
import MinimalLayout from 'layout/MinimalLayout';
import GuestGuard from './route-guard/GuestGuard';
import Loadable from 'components/Loadable';
import NavMotion from 'layout/NavMotion';

// login routing
const AuthLogin = Loadable(lazy(() => import('views/pages/authentication/Login')));
const AuthRegister = Loadable(lazy(() => import('views/pages/authentication/Register')));

const LoginRoutes = {
    path: '/',
    element: (
        <NavMotion>
            <GuestGuard>
                <MinimalLayout />
            </GuestGuard>
        </NavMotion>
    ),
    children: [
        {
            path: '/',
            element: <AuthLogin />
        },
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
