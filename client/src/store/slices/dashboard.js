// third-party
import { createSlice } from '@reduxjs/toolkit';

// internal imports
import axios from 'axios';
import { dispatch } from '../index';

const VITE_APP_MODE = import.meta.env.VITE_APP_MODE;
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
        // Get Total Yearly Subscriptions By Months, and Total Subscriptions, and Total Members
        const thisYear = new Date().getFullYear()
        const response = await axios.get(`${VITE_APP_MODE === "production" ? VITE_APP_ORIGIN_PRODUCTION : VITE_APP_ORIGIN_DEV}/subscriptions/yearlyData/${thisYear}`, { headers: { "Authorization": `Bearer ${token}` } });
        let data = {};
        data.countMember = response.data.countMember;
        data.countSubscription = response.data.countSubscription;
        data.yearlyData = response.data.yearlyData;
        return data;
    } catch (error) {
        dispatch(slice.actions.hasError(error));
        return error;
    }
};

export async function getMoviesDataForDashboard() {
    try {
        let token = window.localStorage.getItem('accessToken');
        // console.log('getMoviesDataForDashboard ==========>');
        const response = await axios.get(`${VITE_APP_MODE === "production" ? VITE_APP_ORIGIN_PRODUCTION : VITE_APP_ORIGIN_DEV}/movies/mostPopular`, { headers: { "Authorization": `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        dispatch(slice.actions.hasError(error));
    }
}