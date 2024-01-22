// third-party
import { createSlice } from '@reduxjs/toolkit';

// internal imports
import axios from 'axios';
import { dispatch } from '../index';

const MOVIES_URL = import.meta.env.VITE_APP_MOVIES_URL;

// ----------------------------------------------------------------------

const initialState = {
    error: null,
    addresses: [],
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

        // GET ADDRESSES
        // getAddressesSuccess(state, action) {
        //     state.addresses = action.payload;
        // },

        // ADD ADDRESS
        // addAddressSuccess(state, action) {
        //     state.addresses = action.payload;
        // },

        // EDIT ADDRESS
        // editAddressSuccess(state, action) {
        //     state.addresses = action.payload;
        // },
        // GET Movies
        getMoviesSuccess: (state, action) => {
            state.movies = action.payload;
            state.error = null;
        },

    }
});

// Reducer
export default slice.reducer;

// ⬇️ this is the redux functions

// export function getAddresses() {
//     return async () => {
//         try {
//             const response = await axios.get('/api/address/list');
//             dispatch(slice.actions.getAddressesSuccess(response.data.address));
//         } catch (error) {
//             dispatch(slice.actions.hasError(error));
//         }
//     };
// }

// export function addAddress(address) {
//     return async () => {
//         try {
//             const response = await axios.post('/api/address/new', address);
//             dispatch(slice.actions.addAddressSuccess(response.data.address));
//         } catch (error) {
//             dispatch(slice.actions.hasError(error));
//         }
//     };
// }

// export function editAddress(address) {
//     return async () => {
//         try {
//             const response = await axios.post('/api/address/edit', address);
//             dispatch(slice.actions.editAddressSuccess(response.data.address));
//         } catch (error) {
//             dispatch(slice.actions.hasError(error));
//         }
//     };
// }

// ⬇️ this is the loader and error boundary (Until now, the loader includes redux functions)
export async function loader() {
    try {
        let token = window.localStorage.getItem('accessToken');
        console.log('<=== Movies Loader ===>');
        const response = await axios.get(`${MOVIES_URL}/aggregate`, { headers: { "Authorization": `Bearer ${token}` } });
        console.log(response.data);
        dispatch(slice.actions.getMoviesSuccess(response.data));
        return response.data;
    } catch (error) {
        return error;
    }
}

/**********************************************************
 *                                                        *
 *      todo -----> filter in the server [moviesBLL]      *
 *                                                        *
 *//******************************************************/
// export async function filterProducts(filter) {
//     return await axios.post('/api/products/filter', { filter });
// }

export async function filterMovies() {
    try {
        let token = window.localStorage.getItem('accessToken');
        const response = await axios.get(`${MOVIES_URL}/aggregate`, { headers: { "Authorization": `Bearer ${token}` } });
        dispatch(slice.actions.getMoviesSuccess(response.data));
        return response.data;
        
    } catch (error) {
        console.error(error);
    }
}

/*******************************************************************************
 *                                                                             *
 *      todo -----> get by Id with other data from the server [moviesBLL]      *
 *                                                                             *
 *//***************************************************************************/

export async function movieLoader({ params }) {
    try {
        let token = window.localStorage.getItem('accessToken');
        const id = params.id;
        // console.log('<=== M o v i e Loader ===>');
        const response = await axios.get(`${MOVIES_URL}/${id}`, { headers: { "Authorization": `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        return error;
    }
}

export function createMovie(movie) {
    return async () => {
        try {
            let token = window.localStorage.getItem('accessToken');
            console.log('Here we create movie');
            const response = await axios.post(`${MOVIES_URL}`, movie, { headers: { "Authorization": `Bearer ${token}` } });
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    };
}

export function updateMovie(id, movie) {
    return async () => {
        try {
            let token = window.localStorage.getItem('accessToken');
            const response = await axios.put(`${MOVIES_URL}/${id}`, movie, { headers: { "Authorization": `Bearer ${token}` } });
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    };
}

export function deleteMovie(id) {
    return async () => {
        try {
            let token = window.localStorage.getItem('accessToken');
            console.log('Pay attention - You may delete the movie');
            // const response = await axios.delete(`${MOVIES_URL}/${id}`, { headers: { "Authorization": `Bearer ${token}` } });
            // console.log(response);
        } catch (error) {
            console.error(error);
        }
    };
}