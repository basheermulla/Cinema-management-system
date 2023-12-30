const Movie = require('../models/movieModel.js');
const movieWS = require('../DAL/moviesWS');

/*=======================================================================================================
/*================================//* Movies Collection MongoDB *//*=====================================
/*============================//* CRUD - Create, Read, Update, Delete *//*===============================
/*=====================================================================================================*/

// GET - Get All Movies - Read
const getAllMovies = async () => {
    return Movie.find();
};

// GET - Get Movie By Id - Read
const getMovieById = (id) => {
    return Movie.findById({ _id: id })
};

// POST - Create a Movie
const addMovie = async (obj) => {
    const movie = new Movie(obj);
    await movie.save();
    return 'Created';
};

// InsertMany - Insert multiple Movies
const addManyMovies = async (objMany) => {
    // Prevent additional documents from being inserted if one fails
    const options = { ordered: true };
    // Execute insert operation
    await Movie.insertMany(objMany, options);
    return 'Created Many';
};

// PUT - Update a Movie
const updateMovie = async (id, obj) => {
    await Movie.findByIdAndUpdate(id, obj);
    return 'Updated';
};

// DELETE - Delete a Movie
const deleteMovie = async (id) => {
    await Movie.findByIdAndDelete(id);
    return 'Deleted';
};

/*=======================================================================================================
/*===============================//* Work with - DAL/moviesWS.js *//*====================================
/*============================//* Get - All movies from external WS *//*=================================
/*========================//* Entry Point:> https://api.tvmaze.com/shows *//*============================
/*=====================================================================================================*/

// GET - Get All Members - Read
const getAllMoviesWS = async (id = '') => {
    const { data: movies } = await movieWS.getAllMoviesWS(id);    //From WS
    // console.log('movies = ', movies);
    return movies;
};

module.exports = {
    getAllMovies,
    getMovieById,
    addMovie,
    addManyMovies,
    updateMovie,
    deleteMovie,
    getAllMoviesWS
};