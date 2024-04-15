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
        // console.log('<=== Dashboard Loader ===>');        
        const { data } = await axios.get(`${APP_MODE === "production" ? VITE_APP_ORIGIN_PRODUCTION : VITE_APP_ORIGIN_DEV}/members/subscriptionsUnwind`, { headers: { "Authorization": `Bearer ${token}` } });
        const users = await axios.get(`${APP_MODE === "production" ? VITE_APP_ORIGIN_PRODUCTION : VITE_APP_ORIGIN_DEV}/users`, { headers: { "Authorization": `Bearer ${token}` } });
        const popular_movies = await axios.get(`${APP_MODE === "production" ? VITE_APP_ORIGIN_PRODUCTION : VITE_APP_ORIGIN_DEV}/movies/mostPopular`, { headers: { "Authorization": `Bearer ${token}` } });
        const thisYear = new Date().getFullYear()
        const yearlySubscriptionsData = await axios.get(`${APP_MODE === "production" ? VITE_APP_ORIGIN_PRODUCTION : VITE_APP_ORIGIN_DEV}/subscriptions/yearlyData/${thisYear}`, { headers: { "Authorization": `Bearer ${token}` } });
        data.users = users.data;
        data.popular_movies = popular_movies.data;
        data.yearlySubscriptionsData = yearlySubscriptionsData.data;
        return data;
    } catch (error) {
        dispatch(slice.actions.hasError(error));
        return error;
    }
};