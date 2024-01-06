import { RouterProvider } from 'react-router-dom';

import PocMembersPage from "views/poc-members-page/PocMembersPage"

// auth provider
import { AuthProvider } from 'contexts/AuthContext';

// routing
import router from 'routes';


function App() {

  return (
    <>
      {/* <PocMembersPage /> */}

      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>

    </>
  )
}

export default App
