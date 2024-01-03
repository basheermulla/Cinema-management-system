const SubscriptionsWS = require('../DAL/subscriptionsWS')

/*=======================================================================================================
/*==============================//* Work with - DAL/subscriptionsWS.js *//*=====================================
/*====================//* Provided by:> "My Subscriptions REST API Server" *//*==========================
/*=====================================================================================================*/

// GET - Get All Subscriptions with the [Movies, Members] data
const getAllSubscriptionsAggregation = async () => {
    let { data: subscriptions } = await SubscriptionsWS.getAllSubscriptionsAggregationWS();
    return subscriptions;
}

// GET - Get All Subscriptions
const getAllSubscriptions = async () => {
    let { data: subscriptions } = await SubscriptionsWS.getAllSubscriptionsWS();
    return subscriptions;
}

// GET - Get Subscription By Id
const getSubscriptionById = async (id) => {
    let { data: subscription } = await SubscriptionsWS.getSubscriptionByIdWS(id);
    return subscription;
}

// POST - Create a Subscription
const addSubscription = async (obj) => {
    const { data: result } = await SubscriptionsWS.addFirstSubscriptionWS(obj);
    return result;
}

// PUT - Update a Subscription by memberId
const updateSubscriptionByMemberId = async (id, obj) => {
    const { data: result } = await SubscriptionsWS.updateSubscriptionByMemberIdWS(id, obj);
    return result;
}

// DELETE - Delete a Subscription
const deleteSubscription = async (id) => {
    const { data: result } = await SubscriptionsWS.deleteSubscriptionWS(id);
    return result;
}

module.exports = { 
    getAllSubscriptionsAggregation,
    getAllSubscriptions,
    getSubscriptionById,
    addSubscription,
    updateSubscriptionByMemberId,
    deleteSubscription,
}