import { createBrowserRouter } from 'react-router-dom';

// routes
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';

const router = createBrowserRouter([LoginRoutes, MainRoutes], { basename: import.meta.env.VITE_APP_BASE_NAME })

export default router;
