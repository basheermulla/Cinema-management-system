// third-party
import { createSlice } from '@reduxjs/toolkit';

// internal imports
import axios from 'axios';
import { dispatch } from '../index';

const MOVIES_URL = import.meta.env.VITE_APP_MOVIES_URL;

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
        const response = await axios.get(`${MOVIES_URL}`, { headers: { "Authorization": `Bearer ${token}` } });
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
        const response = await axios.get(`${MOVIES_URL}/movie-subscriptions/${id}`, { headers: { "Authorization": `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        dispatch(slice.actions.hasError(error));
    }
}


// ⬇️ this is the <CRUD && filter && related functions> for movie model

export async function filterMovies(filter) {
    try {
        let token = window.localStorage.getItem('accessToken');
        const response = await axios.post(`${MOVIES_URL}/filter`,filter , { headers: { "Authorization": `Bearer ${token}` } });
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
            const response = await axios.get(`${MOVIES_URL}/related-movies/${id}`, { headers: { "Authorization": `Bearer ${token}` } });
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
            const response = await axios.post(`${MOVIES_URL}`, movie, { headers: { "Authorization": `Bearer ${token}` } });
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function updateMovie(id, movie) {
    return async () => {
        try {
            let token = window.localStorage.getItem('accessToken');
            const response = await axios.put(`${MOVIES_URL}/${id}`, movie, { headers: { "Authorization": `Bearer ${token}` } });
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
            const response = await axios.delete(`${MOVIES_URL}/${id}`, { headers: { "Authorization": `Bearer ${token}` } });
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}