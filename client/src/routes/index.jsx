import { createBrowserRouter } from 'react-router-dom';

// routes
import LoginRoutes from './LoginRoutes';

const router = createBrowserRouter([LoginRoutes], { basename: import.meta.env.VITE_APP_BASE_NAME })

export default router;
