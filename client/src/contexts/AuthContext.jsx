import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';
import axios from 'axios';

// reducer - state management
import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer';

// internal imports
import Loader from 'components/Loader';

// constant
const initialState = {
    isLoggedIn: false,
    isInitialized: false,
    user: null
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(accountReducer, initialState);

    const login = async (username, password) => {        
        const response = await axios.post(`${import.meta.env.VITE_APP_AUTH_URL}/login`, { username, password });
        console.log(response.data);
        const { user, accessToken, message } = response.data;
        console.log(user, accessToken, message,);
        console.log(user, accessToken, message);
        if (user) {
            localStorage.setItem('userLogin', user);
            localStorage.setItem('accessToken', accessToken);
            dispatch({ type: LOGIN, payload: { isLoggedIn: true, user } });
        }
    };

    const register = async (username, password) => {
        const response = await axios.post(`${import.meta.env.VITE_APP_AUTH_URL}/register`, { username, password, });
        const { message, error } = response.data;

        if (message === 'User registered successfully') {
            console.log('message = ', message);
        }
    };

    const logout = () => {
        localStorage.removeItem('userLogin');
        dispatch({ type: LOGOUT });
    };

    useEffect(() => {
        const init = async () => {
            try {
                const user = window.localStorage.getItem('userLogin');
                const accessToken = window.localStorage.getItem('accessToken');
                console.log('init user = ', user);
                console.log('init accessToken = ', accessToken);
                if (user) {
                    dispatch({ type: LOGIN, payload: { isLoggedIn: true, user } });
                } else {
                    dispatch({ type: LOGOUT });
                }
            } catch (err) {
                console.error(err);
                dispatch({ type: LOGOUT });
            }
        };
        console.log(state.isInitialized);
        init();
    }, []);

    if (state.isInitialized !== undefined && !state.isInitialized) {
        console.log(state);
        return <Loader />;
    }

    return (
        <AuthContext.Provider value={{ ...state, login, logout, register }}>{children}</AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node
};

export default AuthContext