const axios = require('axios');

const { SUBSCRIPTIONS_WS_URL } = process.env;

/*=======================================================================================================
/*======================//* Provided by:> "My Subscriptions REST API Server" *//*========================
/*============================//* CRUD - Create, Read, Update, Delete *//*===============================
/*=====================//* Entry Point:> https://localhost:8080/subscriptions *//*=======================
/*=====================================================================================================*/

// GET - Get All Subscriptions with the widthly data by use MongoDB aggregation pipeline - Read
const getAllSubscriptionsAggregationWS = () => axios.get(`${SUBSCRIPTIONS_WS_URL}/aggregate`);

// GET - Get This Yearly Subscriptions - Read
const getYearlySubscriptionsWS = (year) => axios.get(`${SUBSCRIPTIONS_WS_URL}/yearlyData/${year}`);

// GET - Get All Subscriptions - Read
const getAllSubscriptionsWS = () => axios.get(`${SUBSCRIPTIONS_WS_URL}`);

// GET - Get Subscription By Id - Read
const getSubscriptionByIdWS = (id) => axios.get(`${SUBSCRIPTIONS_WS_URL}/${id}`);

// POST - Create the first Subscription of member
const addFirstSubscriptionWS = (obj) => axios.post(SUBSCRIPTIONS_WS_URL, obj);

// PUT - Update a Subscription by memberId
const updateSubscriptionByMemberIdWS = (id, obj) => axios.put(`${SUBSCRIPTIONS_WS_URL}/${id}`, obj);

// DELETE - Delete a Subscription
const deleteSubscriptionWS = (id) => axios.delete(`${SUBSCRIPTIONS_WS_URL}/${id}`);

module.exports = {
    getAllSubscriptionsAggregationWS,
    getYearlySubscriptionsWS,
    getAllSubscriptionsWS,
    getSubscriptionByIdWS,
    addFirstSubscriptionWS,
    updateSubscriptionByMemberIdWS,
    deleteSubscriptionWS
};