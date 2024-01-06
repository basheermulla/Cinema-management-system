// Internal imports
import MinimalLayout from 'layout/MinimalLayout';
import GuestGuard from './route-guard/GuestGuard';
import AuthLogin from 'views/pages/authentication/Login';
import AuthRegister from 'views/pages/authentication/Register';
import PocMembersPage from 'views/poc-members-page/PocMembersPage';

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
        },
        {
            path: '/members-page',
            element: <PocMembersPage />
        }
    ]
}

export default LoginRoutes;
