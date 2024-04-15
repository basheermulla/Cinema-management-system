// third-party
import { createSlice } from '@reduxjs/toolkit';

// internal imports
import axios from 'axios';
import { dispatch } from '../index';

const APP_MODE = import.meta.env.APP_MODE;
const VITE_APP_ORIGIN_DEV = import.meta.env.VITE_APP_ORIGIN_DEV;
const VITE_APP_ORIGIN_PRODUCTION = import.meta.env.VITE_APP_ORIGIN_PRODUCTION;

// ----------------------------------------------------------------------

const initialState = {
    error: null,
    users: [],
    employees: []
};

const slice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET USERS
        getUsersListSuccess(state, action) {
            state.users = action.payload;
        },
    }
});

// Reducer
export default slice.reducer;

// ⬇️ this is the loader and error boundary (Until now, the loader includes redux functions)

export async function loader() {
    try {
        let token = window.localStorage.getItem('accessToken');
        // console.log('<=== Users Loader ===>');
        const response = await axios.get(`${APP_MODE === "production" ? VITE_APP_ORIGIN_PRODUCTION : VITE_APP_ORIGIN_DEV}/users`, { headers: { "Authorization": `Bearer ${token}` } });
        dispatch(slice.actions.getUsersListSuccess(response.data));
        return response.data;
    } catch (error) {
        dispatch(slice.actions.hasError(error));
        return error;
    }
};

export async function getDesireUserById(id) {
    try {
        let token = window.localStorage.getItem('accessToken');
        // console.log('<=== Users getDesireUser ===> ', id);
        const response = await axios.get(`${APP_MODE === "production" ? VITE_APP_ORIGIN_PRODUCTION : VITE_APP_ORIGIN_DEV}/users/${id}`, { headers: { "Authorization": `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        dispatch(slice.actions.hasError(error));
    }
};

export function createUser(user) {
    return async () => {
        try {
            let token = window.localStorage.getItem('accessToken');
            // console.log('Here we create user = ', user);
            const response = await axios.post(`${APP_MODE === "production" ? VITE_APP_ORIGIN_PRODUCTION : VITE_APP_ORIGIN_DEV}/users`, user, { headers: { "Authorization": `Bearer ${token}` } });
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
};

export function updateUser(id, user) {
    return async () => {
        try {
            let token = window.localStorage.getItem('accessToken');
            const { _id: userId } = id;
            // console.log('Here we update user = ', userId, ' |----------| ', user);
            const response = await axios.put(`${APP_MODE === "production" ? VITE_APP_ORIGIN_PRODUCTION : VITE_APP_ORIGIN_DEV}/users/${userId}`, user, { headers: { "Authorization": `Bearer ${token}` } });
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
};

export function deleteUser(id) {
    return async () => {
        try {
            let token = window.localStorage.getItem('accessToken');
            // console.log('Pay attention - You may delete the user = ', id);
            const response = await axios.delete(`${APP_MODE === "production" ? VITE_APP_ORIGIN_PRODUCTION : VITE_APP_ORIGIN_DEV}/users/${id}`, { headers: { "Authorization": `Bearer ${token}` } });
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
};
