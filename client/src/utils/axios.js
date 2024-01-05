/**
 * axios setup to use mock service
 */

import axios from 'axios';

const axiosServices = axios.create({ baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:3010/' });

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

axiosServices.interceptors.request.use(
    async (config) => {
        // console.log('Axios - await get.request.use - Login', config);
        const accessToken = localStorage.getItem('serviceToken');
        // console.log('Axios - await get.request.use - accessToken', accessToken);
        if (accessToken) {
            // console.log('Axios - await get.request.use - if (accessToken)', accessToken);
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosServices.interceptors.response.use(
    (response) => {
        // console.log('Axios - await post.response.use - Login', response);
        return response
    },
    (error) => {
        if (error.response?.status === 401 && !window.location.href.includes('/login')) {
            window.location.pathname = '/pages/error';
        }
        return Promise.reject((error.response && error.response.data) || 'Wrong Services');
    }
);

export default axiosServices;
