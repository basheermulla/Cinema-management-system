const Movie = require('../models/movieModel.js');

/*=======================================================================================================
/*================================//* Movies Collection MongoDB *//*=====================================
/*================================//*  Work with - moviesDAL.js *//*=====================================
/*============================//* CRUD - Create, Read, Update, Delete *//*===============================
/*=====================================================================================================*/

// GET - Get All Movies - Read
const getAllMovies = async () => {
    return Movie.find()
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

module.exports = {
    getAllMovies,
    getMovieById,
    addMovie,
    updateMovie,
    deleteMovie
};