// third-party
import { createSlice } from '@reduxjs/toolkit';

// internal imports
import axios from 'axios';
import { dispatch } from '../index';
import useSocket from 'hooks/useSocket';

const USERS_URL = import.meta.env.VITE_APP_USERS_URL;
const MOVIES_URL = import.meta.env.VITE_APP_MOVIES_URL;
const MEMBERS_URL = import.meta.env.VITE_APP_MEMBERS_URL;
const SUBSCRIPTIONS_URL = import.meta.env.VITE_APP_SUBSCRIPTIONS_URL;

// ----------------------------------------------------------------------

const initialState = {
    error: null,
};

const slice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },
    }
});

// Reducer
export default slice.reducer;

// ⬇️ this is the loader and error boundary (Until now, the loader includes redux functions)

export async function loader() {
    try {

        // Optional optimization - to reduce the number of requests to the server, in my case, I have chosen the following way for learning
        let token = window.localStorage.getItem('accessToken');
        console.log('<=== Dashboard Loader ===>');        
        const { data } = await axios.get(`${MEMBERS_URL}/subscriptionsUnwind`, { headers: { "Authorization": `Bearer ${token}` } });
        const users = await axios.get(`${USERS_URL}`, { headers: { "Authorization": `Bearer ${token}` } });
        const popular_movies = await axios.get(`${MOVIES_URL}/mostPopular`, { headers: { "Authorization": `Bearer ${token}` } });
        const thisYear = new Date().getFullYear()
        const yearlySubscriptionsData = await axios.get(`${SUBSCRIPTIONS_URL}/yearlyData/${thisYear}`, { headers: { "Authorization": `Bearer ${token}` } });
        data.users = users.data;
        data.popular_movies = popular_movies.data;
        data.yearlySubscriptionsData = yearlySubscriptionsData.data;
        console.log('response_For_Dashboard = ', data);
        return data;
    } catch (error) {
        return error;
    }
};