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
    movies: []
};

const slice = createSlice({
    name: 'movie',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET Movies
        getMoviesSuccess: (state, action) => {
            state.movies = action.payload;
            state.error = null;
        },
    }
});

// Reducer
export default slice.reducer;


// ⬇️ this is the <movies && movie loader> and error boundary for movie model
export async function loader() {
    try {
        let token = window.localStorage.getItem('accessToken');
        // console.log('<=== Movies Loader ===>');
        const response = await axios.get(`${VITE_APP_MODE === "production" ? VITE_APP_ORIGIN_PRODUCTION : VITE_APP_ORIGIN_DEV}/movies/240`, { headers: { "Authorization": `Bearer ${token}` } });
        dispatch(slice.actions.getMoviesSuccess(response.data));
        return response.data;
    } catch (error) {
        dispatch(slice.actions.hasError(error));
        return error;
    }
}

export async function movieLoader({ params }) {
    try {
        let token = window.localStorage.getItem('accessToken');
        const id = params.id;
        // console.log('<=== M o v i e Loader ===> ', params);
        const response = await axios.get(`${VITE_APP_MODE === "production" ? VITE_APP_ORIGIN_PRODUCTION : VITE_APP_ORIGIN_DEV}/movies/movie-subscriptions/${id}`, { headers: { "Authorization": `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        dispatch(slice.actions.hasError(error));
    }
}


// ⬇️ this is the <CRUD && filter && related functions> for movie model

export async function filterMovies(filter) {
    try {
        let token = window.localStorage.getItem('accessToken');
        const response = await axios.post(`${VITE_APP_MODE === "production" ? VITE_APP_ORIGIN_PRODUCTION : VITE_APP_ORIGIN_DEV}/movies/filter`,filter , { headers: { "Authorization": `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        dispatch(slice.actions.hasError(error));
    }
}

export async function getRelatedMovies(id) {
    try {
        let token = window.localStorage.getItem('accessToken');
        // console.log('<=== M o v i e getRelatedMovies ===> ', id);
        if (id) {            
            const response = await axios.get(`${VITE_APP_MODE === "production" ? VITE_APP_ORIGIN_PRODUCTION : VITE_APP_ORIGIN_DEV}/movies/related-movies/${id}`, { headers: { "Authorization": `Bearer ${token}` } });
            return response.data;
        }
    } catch (error) {
        dispatch(slice.actions.hasError(error));
    }
}

export function createMovie(movie) {
    return async () => {
        try {
            let token = window.localStorage.getItem('accessToken');
            // console.log('Here we create movie');
            const response = await axios.post(`${VITE_APP_MODE === "production" ? VITE_APP_ORIGIN_PRODUCTION : VITE_APP_ORIGIN_DEV}/movies`, movie, { headers: { "Authorization": `Bearer ${token}` } });
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function updateMovie(id, movie) {
    return async () => {
        try {
            let token = window.localStorage.getItem('accessToken');
            const response = await axios.put(`${VITE_APP_MODE === "production" ? VITE_APP_ORIGIN_PRODUCTION : VITE_APP_ORIGIN_DEV}/movies/${id}`, movie, { headers: { "Authorization": `Bearer ${token}` } });
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function deleteMovie(id) {
    return async () => {
        try {
            let token = window.localStorage.getItem('accessToken');
            // console.log('Pay attention - You may delete the movie');
            const response = await axios.delete(`${VITE_APP_MODE === "production" ? VITE_APP_ORIGIN_PRODUCTION : VITE_APP_ORIGIN_DEV}/movies/${id}`, { headers: { "Authorization": `Bearer ${token}` } });
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}