const axios = require('axios');

const { MEMBERS_URL } = process.env;

/*=======================================================================================================
/*=======================//* Provided by:> "jsonplaceholder REST API/users" *//*=========================
/*===================================//* CRUD - Read only *//*===========================================
/*==================//* Entry Point:> https://jsonplaceholder.typicode.com/users *//*====================
/*=====================================================================================================*/

// GET - Get All Members - Read
const getAllMembersWS = (amount = '') => {
    return axios.get(`${MEMBERS_URL}?_limit=${amount}`)
};

module.exports = { 
    getAllMembersWS
};
