import { RouterProvider } from 'react-router-dom';

// internal imports

// auth provider
import { AuthProvider } from 'contexts/AuthContext';

// routing
import router from 'routes';


function App() {

  return (
    <>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
    </>
  )
}

export default App
