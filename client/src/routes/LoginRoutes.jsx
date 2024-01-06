// Internal imports
import MinimalLayout from 'layout/MinimalLayout';
import GuestGuard from './route-guard/GuestGuard';
import AuthLogin from 'views/pages/authentication/Login';
import AuthRegister from 'views/pages/authentication/Register';

const LoginRoutes = {
    path: '/',
    element: (
        <GuestGuard>
            <MinimalLayout />
        </GuestGuard>
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
