import { RouterProvider } from 'react-router-dom';

// internal imports
import Locales from 'components/Locales';

// them customization [Context]
import ThemeCustomization from 'themes';

// auth provider [Context]
import { AuthProvider } from 'contexts/AuthContext';

// routing
import router from 'routes';

function App() {

  return (
    <ThemeCustomization>
      <Locales>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </Locales>
    </ThemeCustomization>
  )
}

export default App
