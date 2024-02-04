const express = require('express');
const moviesBLL = require('../BLL/moviesBLL');

const router = express.Router();

/*======================================================================================================
/*================================//* Work with - moviesBLL.js *//*=====================================
/*===========================//* CRUD - Create, Read, Update, Delete *//*===============================
/*=========================//* Entry Point:> http://localhost:8080/movies *//*==========================
/*====================================================================================================*/

// Get All Movies with the widthly data by use MongoDB aggregation pipeline - Read
router.get('/aggregate', async (req, res) => {
    try {
        const movies = await moviesBLL.getAllMoviesAggregation();
        res.send(movies);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// GET - Get All popular movies by [number of subscriptions] - Read
router.get('/mostPopular', async (req, res) => {
    try {
        const movies = await moviesBLL.getAllPopularMovies();
        res.send(movies);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// Get All Movies
router.get('/', async (req, res) => {
    try {
        const movies = await moviesBLL.getAllMovies();
        res.send(movies);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// GET - Get Movie By Id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await moviesBLL.getMovieById(id);
        res.send(movie);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// POST - Create a Movie
router.post('/', async (req, res) => {
    try {
        const obj = req.body; // In use
        const result = await moviesBLL.addMovie(obj);
        res.status(201).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// PUT - Update a Movie
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const obj = req.body;
        const result = await moviesBLL.updateMovie(id, obj, { new: true });
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// DELETE - Delete a Movie
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await moviesBLL.deleteMovie(id);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

module.exports = router;