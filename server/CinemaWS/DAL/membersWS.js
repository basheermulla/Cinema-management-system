const axios = require('axios');

const { MEMBERS_WS_URL } = process.env;

/*=======================================================================================================
/*======================//* Provided by:> "My Subscriptions REST API Server" *//*========================
/*============================//* CRUD - Create, Read, Update, Delete *//*===============================
/*========================//* Entry Point:> https://localhost:8080/members *//*==========================
/*=====================================================================================================*/

// GET - Get All Members with the widthly data by use MongoDB aggregation pipeline - Read
const getAllMembersAggregationWS = () => axios.get(`${MEMBERS_WS_URL}/aggregate`)

// GET - Get All Members - Read
const getAllMembersWS = () => axios.get(`${MEMBERS_WS_URL}`)

// GET - Get Member By Id - Read
const getMemberByIdWS = (id) => axios.get(`${MEMBERS_WS_URL}/${id}`);

// POST - Create a Member
const addMemberWS = (obj) => axios.post(MEMBERS_WS_URL, obj);

// PUT - Update a Member
const updateMemberWS = (id, obj) => axios.put(`${MEMBERS_WS_URL}/${id}`, obj);

// DELETE - Delete a Member
const deleteMemberWS = (id) => axios.delete(`${MEMBERS_WS_URL}/${id}`);

module.exports = {
    getAllMembersAggregationWS,
    getAllMembersWS,
    getMemberByIdWS,
    addMemberWS,
    updateMemberWS,
    deleteMemberWS,
};