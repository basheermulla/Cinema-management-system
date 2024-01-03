const axios = require('axios');

const { MOVIES_WS_URL } = process.env;

/*=======================================================================================================
/*======================//* Provided by:> "My Subscriptions REST API Server" *//*========================
/*============================//* CRUD - Create, Read, Update, Delete *//*===============================
/*=========================//* Entry Point:> https://localhost:8080/movies *//*==========================
/*=====================================================================================================*/

// GET - Get All Movies with the widthly data by use MongoDB aggregation pipeline - Read
const getAllMoviesAggregationWS = () => axios.get(`${MOVIES_WS_URL}/aggregate`);

// GET - Get All Movies - Read
const getAllMoviesWS = () => axios.get(`${MOVIES_WS_URL}`);

// GET - Get Movie By Id - Read
const getMovieByIdWS = (id) => axios.get(`${MOVIES_WS_URL}/${id}`);

// POST - Create a Movie
const addMovieWS = (obj) => axios.post(MOVIES_WS_URL, obj);

// PUT - Update a Movie
const updateMovieWS = (id, obj) => axios.put(`${MOVIES_WS_URL}/${id}`, obj);

// DELETE - Delete a Movie
const deleteMovieWS = (id) => axios.delete(`${MOVIES_WS_URL}/${id}`);

module.exports = {
    getAllMoviesAggregationWS,
    getAllMoviesWS,
    getMovieByIdWS,
    addMovieWS,
    updateMovieWS,
    deleteMovieWS,
};