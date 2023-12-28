const Subscription = require('../models/subscriptionModel.js');

/*=======================================================================================================
/*================================//* Subscriptions Collection MongoDB *//*====================================
/*============================//* CRUD - Create, Read, Update, Delete *//*===============================
/*=====================================================================================================*/

// GET - Get All Subscriptions - Read
const getAllSubscriptions = async () => {
    return Subscription.find()
};

// GET - Get Subscription By Id - Read
const getSubscriptionById = (id) => {
    return Subscription.findById({ _id: id })
};

// POST - Create a Subscription
const addSubscription = async (obj) => {
    const subscription = new Subscription(obj);
    await subscription.save();
    return 'Created';
};

// PUT - Update a Subscription
const updateSubscription = async (id, obj) => {
    await Subscription.findByIdAndUpdate(id, obj);
    return 'Updated';
};

// DELETE - Delete a Subscription
const deleteSubscription = async (id) => {
    await Subscription.findByIdAndDelete(id);
    return 'Deleted';
};

module.exports = {
    getAllSubscriptions,
    getSubscriptionById,
    addSubscription,
    updateSubscription,
    deleteSubscription
};