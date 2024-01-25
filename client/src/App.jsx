import { RouterProvider } from 'react-router-dom';

// internal imports
import Locales from 'components/Locales';

// them customization [Context]
import ThemeCustomization from 'themes';

// auth provider [Context]
import { AuthProvider } from 'contexts/AuthContext';

// socket provider [Context]
import { SocketProvider } from 'contexts/SocketContext';

// routing
import router from 'routes';

function App() {

  return (
    <ThemeCustomization>
      <Locales>
        <AuthProvider>
          <SocketProvider>
            <RouterProvider router={router} />
          </SocketProvider>
        </AuthProvider>
      </Locales>
    </ThemeCustomization>
  )
}

export default App
