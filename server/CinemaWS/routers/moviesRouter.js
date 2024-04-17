const express = require('express');
const moviesBLL = require('../BLL/moviesBLL');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

/*=======================================================================================================
/*================================//* Work with - moviesBLL.js *//*======================================
/*============================//* CRUD - Create, Read, Update, Delete *//*===============================
/*=========================//* Entry Point:> http://localhost:8082/movies *//*===========================
/*=====================================================================================================*/

// Get All Movies with the widthly data by use MongoDB aggregation pipeline - Read
router.get('/aggregate', verifyToken, async (req, res) => {
    try {
        const movies = await moviesBLL.getAllMoviesAggregation();
        res.send(movies);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// GET - Get All popular movies by [number of subscriptions] - Read
router.get('/mostPopular', verifyToken, async (req, res) => {
    try {
        const movies = await moviesBLL.getAllPopularMovies();
        res.send(movies);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// GET - Get Related Movies by User Id - Read
router.get('/related-movies/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const movies = await moviesBLL.getRelatedMovies(id);
        res.send(movies);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// Get All Movies
router.get('/:limit', verifyToken, async (req, res) => {
    try {
        const { limit } = req.params;
        const movies = await moviesBLL.getAllMovies(limit);
        res.send(movies);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// GET - Get Movie By Id With Subscription - Read
router.get('/movie-subscriptions/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await moviesBLL.getMovieByIdWithSubscriptions(id);
        res.send(movie);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// GET - Get Movie By Id
router.get('/:id', verifyToken, async (req, res) => {
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
router.post('/', verifyToken, async (req, res) => {
    try {
        const obj = req.body; // In use        
        const result = await moviesBLL.addMovie(obj);
        res.status(201).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// POST - filter Movies by Multiple Conditions
router.post('/filter', verifyToken, async (req, res) => {
    try {
        const obj = req.body; // In use        
        const result = await moviesBLL.filterMovies(obj);
        res.status(201).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// PUT - Update a Movie
router.put('/:id', verifyToken, async (req, res) => {
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
router.delete('/:id', verifyToken, async (req, res) => {
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