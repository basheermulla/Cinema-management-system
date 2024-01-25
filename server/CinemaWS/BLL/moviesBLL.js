const MoviesWS = require('../DAL/moviesWS')

/*=======================================================================================================
/*==============================//* Work with - DAL/moviesWS.js *//*=====================================
/*====================//* Provided by:> "My Subscriptions REST API Server" *//*==========================
/*=====================================================================================================*/

// GET - Get All Movies with the [Members, Subscriptions] data
const getAllMoviesAggregation = async () => {
    let { data: movies } = await MoviesWS.getAllMoviesAggregationWS();
    return movies;
}

// GET - Get All popular movies by [number of subscriptions] - Read
const getAllPopularMovies = async () => {
    let { data: movies } = await MoviesWS.getAllPopularMoviesWS();
    return movies;
}

// GET - Get All Movies
const getAllMovies = async () => {
    let { data: movies } = await MoviesWS.getAllMoviesWS();
    return movies;
}

// GET - Get Movie By Id
const getMovieById = async (id) => {
    let { data: movie } = await MoviesWS.getMovieByIdWS(id);
    return movie;
}

// POST - Create a Movie
const addMovie = async (obj) => {
    const { data: result } = await MoviesWS.addMovieWS(obj);
    return result;
}

// PUT - Update a Movie
const updateMovie = async (id, obj) => {
    const { data: result } = await MoviesWS.updateMovieWS(id, obj);
    return result;
}

// DELETE - Delete a Movie
const deleteMovie = async (id) => {
    const { data: result } = await MoviesWS.deleteMovieWS(id);
    return result;
}

module.exports = { 
    getAllMoviesAggregation,
    getAllPopularMovies,
    getAllMovies,
    getMovieById,
    addMovie,
    updateMovie,
    deleteMovie,
}