const axios = require('axios');

const { MOVIES_WS_URL } = process.env;

/*=======================================================================================================
/*======================//* Provided by:> "My Subscriptions REST API Server" *//*========================
/*============================//* CRUD - Create, Read, Update, Delete *//*===============================
/*=========================//* Entry Point:> https://localhost:8080/movies *//*==========================
/*=====================================================================================================*/

// GET - Get All Movies with the widthly data by use MongoDB aggregation pipeline - Read
const getAllMoviesAggregationWS = () => axios.get(`${MOVIES_WS_URL}/aggregate`);

// GET - Get All popular movies by [number of subscriptions] - Read
const getAllPopularMoviesWS = () => axios.get(`${MOVIES_WS_URL}/mostPopular`);

// GET - Get Related Movies by User Id - Read
const getRelatedMoviesWS = (id) => axios.get(`${MOVIES_WS_URL}/related-movies/${id}`);

// Get All Movies per number of a current page and amount movies per page
const getMoviesPerPageWS = (page, perPage) => axios.get(`${MOVIES_WS_URL}/getMoviesPerPage/${page}/${perPage}`);

// GET - Get countDocuments of Movies colliction - Read
const getCountPagesMoviesWS = (perPage) => axios.get(`${MOVIES_WS_URL}/${perPage}`);

// GET - Get Movie By Id With Subscription - Read
const getMovieByIdWithSubscriptionsWS = (id) => axios.get(`${MOVIES_WS_URL}/getMovieById/${id}`);

// GET - Get Movie By Id - Read
const getMovieByIdWS = (id) => axios.get(`${MOVIES_WS_URL}/${id}`);

// POST - Create a Movie
const addMovieWS = (obj) => axios.post(MOVIES_WS_URL, obj);

// POST - Create a Movie
const filterMoviesWS = (obj) => axios.post(`${MOVIES_WS_URL}/filter`, obj);

// PUT - Update a Movie
const updateMovieWS = (id, obj) => axios.put(`${MOVIES_WS_URL}/${id}`, obj);

// DELETE - Delete a Movie
const deleteMovieWS = (id) => axios.delete(`${MOVIES_WS_URL}/${id}`);

module.exports = {
    getAllMoviesAggregationWS,
    getAllPopularMoviesWS,
    getRelatedMoviesWS,
    getMoviesPerPageWS,
    getCountPagesMoviesWS,
    getMovieByIdWithSubscriptionsWS,
    getMovieByIdWS,
    addMovieWS,
    filterMoviesWS,
    updateMovieWS,
    deleteMovieWS,
};