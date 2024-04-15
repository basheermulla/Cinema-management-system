import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useState } from 'react';
import axios from 'axios';

// material-ui
import { Dialog, DialogActions, DialogContent, DialogContentText, Button } from '@mui/material';

// reducer - state management
import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer';

// internal imports
import Loader from 'components/Loader';

const APP_MODE = import.meta.env.APP_MODE;
const VITE_APP_ORIGIN_DEV = import.meta.env.VITE_APP_ORIGIN_DEV;
const VITE_APP_ORIGIN_PRODUCTION = import.meta.env.VITE_APP_ORIGIN_PRODUCTION;
// constant
const initialState = {
    isLoggedIn: false,
    isInitialized: false,
    user: null,
    loginTimeOut: null
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(accountReducer, initialState);

    // Dialog state
    const [openDialog, setOpenDialog] = useState(false);

    const handleDialog = () => {
        setOpenDialog(false);
        dispatch({ type: LOGOUT });
        logout();
    }

    const checkTokenExpired = () => {
        const current_time = new Date();
        const loginTimeOut = window.localStorage.getItem('loginTimeOut');
        if (current_time > new Date(loginTimeOut)) {
            return true;
        } else {
            return false;
        }
    }

    const login = async (username, password) => {
        const response = await axios.post(`${APP_MODE === "production" ? VITE_APP_ORIGIN_PRODUCTION : VITE_APP_ORIGIN_DEV}/authentication/login`, { username, password });
        const { user, accessToken, message } = response.data;
        if (user) {
            localStorage.setItem('userLogin', JSON.stringify(user));
            localStorage.setItem('accessToken', accessToken);
            const current_time = new Date();
            const loginTimeOut = new Date(current_time.getTime() + user.sessionTimeOut * 60000);
            localStorage.setItem('loginTimeOut', loginTimeOut);

            // Show the alert dialog 5 minutes before the token expires
            setTimeout(() => {
                setOpenDialog(true);
            }, (user.sessionTimeOut * 60000) - 300000);

            // Token expired -> run logout
            setTimeout(() => {
                setOpenDialog(false);
                dispatch({ type: LOGOUT });                
                logout();
            }, user.sessionTimeOut * 60000);
            dispatch({ type: LOGIN, payload: { isLoggedIn: true, loginTimeOut, user } });
        }
    };

    const register = async (username, password) => {
        const response = await axios.post(`${AUTHENTICATION_URL}/register`, { username, password });
        const { message, error } = response.data;

        if (message === 'User registered successfully') {
            // console.log('message = ', message);
        }
    };

    const logout = () => {
        localStorage.removeItem('userLogin');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('loginTimeOut');
        dispatch({ type: LOGOUT });
    };

    useEffect(() => {
        const init = async () => {
            try {
                const userLogin = window.localStorage.getItem('userLogin');
                const user = JSON.parse(userLogin);
                const isTokenExpired = checkTokenExpired();
                if (user && !isTokenExpired) {
                    dispatch({ type: LOGIN, payload: { isLoggedIn: true, user } });
                } else {
                    dispatch({ type: LOGOUT });
                    logout();
                }
            } catch (err) {
                console.error(err);
                dispatch({ type: LOGOUT });
            }
        };
        init();
    }, []);

    if (state.isInitialized !== undefined && !state.isInitialized) {
        return <Loader />;
    }

    return (
        <AuthContext.Provider value={{ ...state, login, logout, register }}>
            {children}
            <Dialog open={openDialog}>
                <DialogContent>
                    <DialogContentText sx={{ fontWeight: 500, color: 'secondary.dark' }}>
                    Your token will expire in the next 5 minutes
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ pr: '20px' }}>
                    <Button autoFocus variant='contained' onClick={handleDialog}>
                        Logout
                    </Button>
                    <Button autoFocus variant='contained' color='error' onClick={() => setOpenDialog(false)}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node
};

export default AuthContext