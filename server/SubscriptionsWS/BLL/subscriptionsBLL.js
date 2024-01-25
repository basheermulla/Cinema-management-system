const Subscription = require('../models/subscriptionModel.js');
const Movie = require('../models/movieModel.js');

/*=======================================================================================================
/*================================//* Subscriptions Collection MongoDB *//*====================================
/*============================//* CRUD - Create, Read, Update, Delete *//*===============================
/*=====================================================================================================*/

// Get All Subscriptions with the widthly data by use MongoDB aggregation pipeline - Read
const getAllSubscriptionsAggregation = async () => {
    console.log('Hello from getAllSubscriptionsAggregation');
    const subscriptions = Subscription.aggregate(
        [
            {
                $lookup:
                {
                    from: "members",
                    localField: "memberId",
                    foreignField: "_id",
                    as: "member"
                }
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$member", 0] }, "$$ROOT"] } }
            },
            {
                $project: { member: 0 }
            },
            //==============================================================================
            //======= The attempt to $lookup with movies collection doesn't success ========
            //=======       There is an unknown problem with a foreign Field        ========
            //==   The strange thing is that it works with https://mongoplayground.net/   ==
            //==============================================================================
            // {
            //     $lookup:
            //     {
            //         from: "movies",
            //         localField: "subscriptionMovies.movieId",
            //         foreignField: "_id",
            //         as: "moviesReleted",
            //     }
            // },
        ]
    ).exec();

    // Accept the subscriptions as asynchronous to give us the ability to work with them
    const resp_subscriptions = await subscriptions;

    // Calculate the amount of member's subscriptions and append to the certain subscription as a property object
    // Because I will probably use it during the development of the frontend
    let memberAmountSubscriptions = 0;

    // Group the member's movies by movie Id, and push the subscribe dates into array dates
    resp_subscriptions.map((subscription) => {
        const data = subscription.subscriptionMovies;
        let hash = [];
        if (data != null) {
            hash = data.reduce((p, c) => (p[c.movieId] ? p[c.movieId].push(c) : p[c.movieId] = [c], p), {}),
                newData = Object.keys(hash).map(k => {
                    const dates = hash[k].map((date) => date.date);
                    memberAmountSubscriptions += dates.length;

                    return ({ movieId: k, dates })
                });
            subscription.groupMemberSubscriptions = newData;
            subscription.memberAmountSubscriptions = memberAmountSubscriptions;
            memberAmountSubscriptions = 0;
        }
        delete subscription.subscriptionMovies;
        return subscription;
    });

    // Get all movies from DB
    const all_Moves = await Movie.find()

    // Append movie's datails into groupMemberSubscriptions
    resp_subscriptions.map((subscription) => {
        const data = subscription.groupMemberSubscriptions;
        if (data != null) {
            const movie_details = subscription.groupMemberSubscriptions.map((movie, i) => {
                const getMovie = all_Moves.find((m) => m._id.toString() === movie.movieId);
                return { ...movie, ...getMovie._doc }
            });
            subscription.groupMemberSubscriptions = { ...subscription.groupMemberSubscriptions, ...movie_details }
        }
        return subscription
    })

    return subscriptions;
};

//
// GET - Get This Yearly Subscriptions - Read
const getYearlySubscriptions = async (year) => {
    console.log('Hello from getYearlySubscriptions = ', +year);
    return Subscription.aggregate(
        [
            { $unwind: "$subscriptionMovies" },
            { $project: { memberId: 0 } },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [
                            "$$ROOT",
                            "$subscriptionMovies"
                        ]
                    }
                }
            },
            { $unset: "subscriptionMovies" },
            {
                $group: {
                    _id: {
                        month: { $month: { $toDate: "$date" } },
                        year: { $year: { $toDate: "$date" } },
                    },
                    total: { $sum: 1 }
                },

            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [
                            "$$ROOT",
                            "$_id"
                        ]
                    }
                }
            },
            { $unset: "_id" },
            { $match: { year: +year } },
            { $sort: { month: 1 } },
        ]
    ).exec();
};

// GET - Get All Subscriptions - Read
const getAllSubscriptions = async () => {
    return Subscription.find()
};

// GET - Get Subscription By Id - Read
const getSubscriptionById = (id) => {
    return Subscription.findById({ _id: id })
};

// POST - Create the first Subscription of member
const addFirstSubscription = async (obj) => {
    const subscription = new Subscription(obj);
    await subscription.save();
    return 'Created';
};

// PUT - Update a Subscription by memberId
// 1. Create another subscription of a member who has already subscribed before
// Or
// 2. Update future subscription
// 3. Delete future subscription
const updateSubscriptionByMemberId = async (id, obj, options) => {
    let query_id = {};
    let query_obj = [];
    if (!obj.subscriptionId) {
        query_id = { memberId: id };
        query_obj = { $push: { subscriptionMovies: obj } }; // 1. Create another subscription of a member who has already subscribed before
    } else if (!obj.action) {
        query_id = { memberId: id, 'subscriptionMovies._id': obj.subscriptionId };
        query_obj = { $set: { "subscriptionMovies.$.movieId": obj.movieId, "subscriptionMovies.$.date": obj.date } }; // 2. Update future subscription
    } else {
        query_id = { memberId: id, 'subscriptionMovies._id': obj.subscriptionId };
        query_obj = { $pull: { "subscriptionMovies": { _id: obj.subscriptionId } } }; // 3. Delete future subscription
    }
    await Subscription.findOneAndUpdate(query_id, query_obj, options);
    return 'Updated';
};

// DELETE - Delete a Subscription
const deleteSubscription = async (id) => {
    await Subscription.findByIdAndDelete(id);
    return 'Deleted';
};

module.exports = {
    getAllSubscriptionsAggregation,
    getYearlySubscriptions,
    getAllSubscriptions,
    getSubscriptionById,
    addFirstSubscription,
    updateSubscriptionByMemberId,
    deleteSubscription
};