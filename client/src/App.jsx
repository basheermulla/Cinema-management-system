import { RouterProvider } from 'react-router-dom';

// internal imports

// them customization [Context]
import ThemeCustomization from 'themes';

// auth provider [Context]
import { AuthProvider } from 'contexts/AuthContext';

// routing
import router from 'routes';

function App() {

  return (
    <ThemeCustomization>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeCustomization>
  )
}

export default App
