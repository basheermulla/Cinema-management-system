import { RouterProvider } from 'react-router-dom';

// internal imports
import Locales from 'components/Locales';
import NavigationScroll from 'layout/NavigationScroll';
import Snackbar from 'components/extended/Snackbar';

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
        <NavigationScroll>
          <AuthProvider>
            <RouterProvider router={router} />
            <Snackbar />
          </AuthProvider>
        </NavigationScroll>
      </Locales>
    </ThemeCustomization>
  )
}

export default App
