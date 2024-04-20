const express = require('express');
const subscriptionsBLL = require('../BLL/subscriptionsBLL');

const router = express.Router();

/*=======================================================================================================
/*==============================//* Work with - subscriptionsBLL.js *//*=================================
/*============================//* CRUD - Create, Read, Update, Delete *//*===============================
/*======================//* Entry Point:> http://localhost:3000/subscriptions *//*=======================
/*=====================================================================================================*/

// Get All Subscriptions with the widthly data by use MongoDB aggregation pipeline - Read
router.get('/aggregate', async (req, res) => {
    try {
        const subscriptions = await subscriptionsBLL.getAllSubscriptionsAggregation();
        res.send(subscriptions);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// GET - Get This Yearly Subscriptions - Read
router.get('/yearlyData/:year', async (req, res) => {
    try {
        const { year } = req.params;
        const yearlySubscriptionsData = await subscriptionsBLL.getYearlySubscriptions(year);
        console.log(yearlySubscriptionsData);
        res.send(yearlySubscriptionsData);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// Get All Subscriptions
router.get('/', async (req, res) => {
    try {
        const subscriptions = await subscriptionsBLL.getAllSubscriptions();
        res.send(subscriptions);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// GET - Get Subscription By Id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const subscription = await subscriptionsBLL.getSubscriptionById(id);
        res.send(subscription);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// POST - Create the first Subscription of member
router.post('/', async (req, res) => {
    try {
        const obj = req.body; // In use
        const result = await subscriptionsBLL.addFirstSubscription(obj);
        res.status(201).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// PUT - Update a Subscription
//That's mean:
// 1. Create another subscription of a member who has already subscribed before
// Or
// 2. Update future subscription
// 3. Delete future subscription
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const obj = req.body;
        const result = await subscriptionsBLL.updateSubscriptionByMemberId(id, obj, { upsert: true });
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// DELETE - Delete a Subscription
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await subscriptionsBLL.deleteSubscription(id);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

module.exports = router;