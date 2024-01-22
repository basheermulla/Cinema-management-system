// third-party
import { createSlice } from '@reduxjs/toolkit';

// internal imports
import axios from 'axios';
import { dispatch } from '../index';

const USERS_URL = import.meta.env.VITE_APP_USERS_URL;

// ----------------------------------------------------------------------

const initialState = {
    error: null,
    users: [],
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
        console.log('<=== Users Loader ===>');
        const response = await axios.get(`${USERS_URL}`, { headers: { "Authorization": `Bearer ${token}` } });
        dispatch(slice.actions.getUsersListSuccess(response.data));
        return response.data;
    } catch (error) {
        return error;
    }
};

export async function getDesireUserById(id) {
    try {
        let token = window.localStorage.getItem('accessToken');
        console.log('<=== Users getDesireUser ===> ', id);
        const response = await axios.get(`${USERS_URL}/${id}`, { headers: { "Authorization": `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export function createUser(user) {
    return async () => {
        try {
            let token = window.localStorage.getItem('accessToken');
            console.log('Here we create user = ', user);
            const response = await axios.post(`${USERS_URL}`, user, { headers: { "Authorization": `Bearer ${token}` } });
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    };
};

export function updateUser(id, user) {
    return async () => {
        try {
            let token = window.localStorage.getItem('accessToken');
            const { _id: userId } = id;
            console.log('Here we update user = ', userId, ' |----------| ', user);
            const response = await axios.put(`${USERS_URL}/${userId}`, user, { headers: { "Authorization": `Bearer ${token}` } });
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    };
};

export function deleteUser(id) {
    return async () => {
        try {
            let token = window.localStorage.getItem('accessToken');
            console.log('Pay attention - You may delete the user = ', id);
            // const response = await axios.delete(`${USERS_URL}/${id}`, { headers: { "Authorization": `Bearer ${token}` } });
            // console.log(response);
        } catch (error) {
            console.error(error);
        }
    };
};
