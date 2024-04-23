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

// GET - Get Related Movies by User Id - Read
const getRelatedMovies = async (id) => {
    let { data: movies } = await MoviesWS.getRelatedMoviesWS(id);
    return movies;
}

// GET - Get All Movies
const getAllMovies = async () => {
    let { data: movies } = await MoviesWS.getAllMoviesWS();
    return movies;
}

// Get All Movies per number of a current page and amount movies per page
const getMoviesPerPage = async (page, perPage) => {
    let { data: movies } = await MoviesWS.getMoviesPerPageWS(page, perPage);
    return movies;
}

// GET - Get countDocuments of Movies colliction - Read
const getCountPagesMovies = async (perPage) => {
    let { data: countPages } = await MoviesWS.getCountPagesMoviesWS(perPage);
    return countPages;
}

// GET - Get Movie By Id With Subscription - Read   
const getMovieByIdWithSubscriptions = async (id) => {
    let { data: movie } = await MoviesWS.getMovieByIdWithSubscriptionsWS(id);
    return movie;
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

// POST - filter Movies by Multiple Conditions
const filterMovies = async (obj) => {
    const { data: result } = await MoviesWS.filterMoviesWS(obj);
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
    getRelatedMovies,
    getAllMovies,
    getMoviesPerPage,
    getCountPagesMovies,
    getMovieByIdWithSubscriptions,
    getMovieById,
    addMovie,
    filterMovies,
    updateMovie,
    deleteMovie,
}