// Internal imports
import MainLayout from 'layout/MainLayout';
import AuthGuard from './route-guard/AuthGuard';
import PocMembersPage from 'views/poc-members-page/PocMembersPage';

const LoginRoutes = {
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
        }
    ]
}

export default LoginRoutes;

