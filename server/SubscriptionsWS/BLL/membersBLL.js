const Member = require('../models/memberModel.js');
const memberWS = require('../DAL/membersWS');
const Movie = require('../models/movieModel.js');
const Subscription = require('../models/subscriptionModel.js');

/*=======================================================================================================
/*================================//* Members Collection MongoDB *//*====================================
/*============================//* CRUD - Create, Read, Update, Delete *//*===============================
/*=====================================================================================================*/

// GET - Get All Members with the widthly data by use MongoDB aggregation pipeline - Read
const getAllMembersAggregation = async () => {
    console.log('Hello from getAllMembersAggregation');
    const members = Member.aggregate(
        [
            {
                $lookup:
                {
                    from: 'subscriptions',
                    let: { "id": '$_id' },
                    pipeline: [
                        {
                            $match:
                            {
                                $expr:
                                    { $eq: ["$$id", "$memberId"] }
                            }
                        },
                        {
                            $project:
                            {
                                _id: 1,
                                memberId: 1,
                                subscriptionMovies:
                                {
                                    $map: {
                                        input: "$subscriptionMovies",
                                        as: "movie",
                                        in: {
                                            movieId: "$$movie.movieId",
                                            dates: "$$movie.date"
                                        }
                                    }
                                }
                            }
                        },
                    ], as: "subscriptionWatched"
                }
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$subscriptionWatched", 0] }, "$$ROOT"] } }
            },
            {
                $project: { subscriptionWatched: 0, memberId: 0 }
            },
        ]
    ).exec();

    // Accept the members as asynchronous to give us the ability to work with them
    const resp_members = await members;
    resp_members.forEach((member) => {
        console.log(member);
    })

    // Calculate the amount of member's subscriptions and append to the certain member's document as a property object
    // Because I will probably use it during the development of the frontend
    let memberAmountSubscriptions = 0;

    // Group the member's movies by movie Id, and push the subscribe dates into array dates
    resp_members.map((member) => {
        const data = member.subscriptionMovies;
        let hash = [];
        if (data != null) {
            hash = data.reduce((p, c) => (p[c.movieId] ? p[c.movieId].push(c) : p[c.movieId] = [c], p), {}),
                newData = Object.keys(hash).map(k => {
                    const dates = hash[k].map((date) => date.dates);
                    memberAmountSubscriptions += dates.length;

                    return ({ movieId: k, dates })
                });
            member.memberMovies = newData;
            member.memberAmountSubscriptions = memberAmountSubscriptions;
            memberAmountSubscriptions = 0;
        }
        delete member.subscriptionMovies;
        return member;
    });

    // Get all movies from DB
    const all_Moves = await Movie.find()

    // append movie datails into memberMovies
    resp_members.map((member) => {
        const data = member.memberMovies;
        if (data != null) {
            const movie_details = member.memberMovies.map((movie, i) => {
                const getMovie = all_Moves.find((m) => m._id.toString() === movie.movieId);
                return { ...movie, ...getMovie._doc }
            });
            member.memberMovies = { ...member.memberMovies, ...movie_details }


        }
        return member
    });

    console.log(members);
    return members;
};

// GET - Get All Members with Unwind Subscriptions & get all movies - Read
const getAllMembersSubscriptionsUnwind = async () => {
    const members = Member.aggregate(
        [
            {
                $lookup:
                {
                    from: 'subscriptions',
                    let: { "id": '$_id' },
                    pipeline: [
                        {
                            $match:
                            {
                                $expr:
                                    { $eq: ["$$id", "$memberId"] }
                            }
                        },
                        {
                            $project:
                            {
                                _id: 1,
                                memberId: 1,
                                subscriptionMovies: 1
                            }
                        },
                    ], as: "subscriptionWatched"
                }
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$subscriptionWatched", 0] }, "$$ROOT"] } }
            },
            {
                $project: { subscriptionWatched: 0, memberId: 0 }
            },
            {
                $unwind: {
                    path: "$subscriptionMovies",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup:
                {
                    from: "movies",
                    localField: "subscriptionMovies.movieId",
                    foreignField: "_id",
                    as: "RelatedMovie",
                }
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: ["$subscriptionMovies", { "subscriptionId": "$subscriptionMovies._id" }, "$$ROOT"]
                    }
                }
            },
            {
                $project: { "subscriptionMovies": 0 }
            },
            {
                $unwind: {
                    path: "$RelatedMovie",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: "$_id",
                    image: { $first: "$image" },
                    name: { $first: "$name" },
                    email: { $first: "$email" },
                    city: { $first: "$city" },
                    relatedMovie: { $push: { movie: "$RelatedMovie", date: "$date", subscriptionId: "$subscriptionId" } }
                }
            },
            { $unwind: "$relatedMovie" },
            { $sort: { "relatedMovie.date": -1 } },
            {
                $group: {
                    _id: "$_id",
                    image: { $first: "$image" },
                    name: { $first: "$name" },
                    email: { $first: "$email" },
                    city: { $first: "$city" },
                    relatedMovie: { $push: "$relatedMovie" }
                }
            }
        ]
    ).exec();

    // Get all movies from DB
    const all_Moves = await Movie.find()
    const all_Members = await members;

    const collect_obj_return = {
        members: all_Members,
        movies: all_Moves
    }
    return collect_obj_return;
};

// GET - Get All Members - Read
const getAllMembers = async () => {
    return Member.find();
};

// GET - Get Member By Id - Read
const getMemberById = (id) => {
    return Member.findById({ _id: id })
};

// POST - Create a Member
const addMember = async (obj) => {
    const member = new Member(obj);
    await member.save();
    return 'Created';
};

// PUT - Update a Member
const updateMember = async (id, obj, options) => {
    await Member.findByIdAndUpdate(id, obj, options);
    return 'Updated';
};

// DELETE - Delete a Member
const deleteMember = async (id) => {
    await Member.findByIdAndDelete(id);
    await Subscription.deleteOne({ memberId: id });
    return 'Deleted';
};

//====================================================================
//=     Working only once, when the Subscriptions server starting    =
//====================================================================

// InsertMany - Insert multiple Members
const addManyMembers = async (objMany) => {
    // Prevent additional documents from being inserted if one fails
    const options = { ordered: true };
    // Execute insert operation
    await Member.insertMany(objMany, options);
    return 'Created Many';
};
//====================================================================

/*=======================================================================================================
/*==============================//* Work with - DAL/membersWS.js *//*====================================
/*===========================//* Get - All members from external WS *//*=================================
/*================//* Entry Point:> https://jsonplaceholder.typicode.com/users *//*======================
/*=====================================================================================================*/

// GET - Get All Members - Read
const getAllMembersWS = async (amount = '') => {
    const { data: members } = await memberWS.getAllMembersWS(amount);    //From WS

    return members;
};

module.exports = {
    getAllMembersAggregation,
    getAllMembersSubscriptionsUnwind,
    getAllMembers,
    getMemberById,
    addMember,
    addManyMembers,
    updateMember,
    deleteMember,
    getAllMembersWS
};