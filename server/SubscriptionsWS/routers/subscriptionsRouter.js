const express = require('express');
const subscriptionsBLL = require('../BLL/subscriptionsBLL');

const router = express.Router();

/*=======================================================================================================
/*==============================//* Work with - subscriptionsBLL.js *//*=================================
/*============================//* CRUD - Create, Read, Update, Delete *//*===============================
/*======================//* Entry Point:> http://localhost:3000/subscriptions *//*=======================
/*=====================================================================================================*/

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

// POST - Create a Subscription
router.post('/', async (req, res) => {
    try {
        const obj = req.body; // In use
        console.log(obj)
        const result = await subscriptionsBLL.addSubscription(obj);
        res.status(201).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// PUT - Update a Subscription
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const obj = req.body;
        const result = await subscriptionsBLL.updateSubscription(id, obj, { new: true });
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