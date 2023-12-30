const axios = require('axios');

const { MOVIES_URL } = process.env;

/*=======================================================================================================
/*===========================//* Provided by:> "tvmaze REST API/shows" *//*==============================
/*===================================//* CRUD - Read only *//*===========================================
/*=========================//* Entry Point:> https://api.tvmaze.com/shows *//*===========================
/*=====================================================================================================*/

// GET - Get All Movies - Read
const getAllMoviesWS = (id = '') => {
    return axios.get(`${MOVIES_URL}`)
};

module.exports = { 
    getAllMoviesWS
};