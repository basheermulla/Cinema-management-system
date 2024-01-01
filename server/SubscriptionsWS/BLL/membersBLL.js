const Member = require('../models/memberModel.js');
const memberWS = require('../DAL/membersWS');
const Movie = require('../models/movieModel.js');

/*=======================================================================================================
/*================================//* Members Collection MongoDB *//*====================================
/*============================//* CRUD - Create, Read, Update, Delete *//*===============================
/*=====================================================================================================*/

// GET - Get All Movies with the widthly data by use MongoDB aggregation pipeline - Read
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

            //==============================================================================
            //=======                       the first attempt                       ========
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
            //==============================================================================
            //=======                       the second attempt                      ========
            //======= The try to $lookup with movies collection doesn't success ============
            //=======       There is an unknown problem with a foreign Field    ============
            //==   The strange thing is that it works with https://mongoplayground.net/   ==
            //==============================================================================
            // {
            //     $lookup: {
            //         from: 'movies',
            //         let: { "id": '$subscriptionMovies.movieId' },
            //         pipeline: [
            //             {
            //                 $match: {
            //                     $expr: { $eq: ["$_id", "$$id"] },
            //                 }
            //             },
            //             {
            //                 $project:
            //                 {
            //                     name: 1,
            //                     type: 1,
            //                     language: 1,
            //                     summary: 1,
            //                     image: 1,
            //                     genres: 1,
            //                     premiered: 1,
            //                 }
            //             }
            //         ],
            //         as: 'target',
            //     }
            // }
        ]
    ).exec();

    // Accept the members as asynchronous to give us the ability to work with them
    const resp_members = await members;

    // Group the member movies by movie Id, and push the subscribe dates into array dates
    resp_members.map((member) => {
        const data = member.subscriptionMovies;
        let hash = [];
        if (data != null) {
            hash = data.reduce((p, c) => (p[c.movieId] ? p[c.movieId].push(c) : p[c.movieId] = [c], p), {}),
                newData = Object.keys(hash).map(k => {
                    const dates = hash[k].map((date) => date.dates);
                    return ({ movieId: k, dates })
                });
            member.memberMovies = newData;
        }
        delete member.subscriptionMovies;
        return member;
    });

    // Get all movies from DB
    const members_With_Moves = await Movie.find()

    // append movie datails into memberMovies
    resp_members.map((member) => {
        const data = member.memberMovies;
        if (data != null) {
            const movie_details = member.memberMovies.map((movie, i) => {
                const getMovie = members_With_Moves.find((m) => m._id.toString() === movie.movieId);
                return { ...movie, ...getMovie._doc }
            });
            member.memberMovies = { ...member.memberMovies, ...movie_details }
        }
        return member
    });


    return members;
};

// GET - Get All Members - Read
const getAllMembers = async () => {
    return Member.find()
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

// InsertMany - Insert multiple Members
const addManyMembers = async (objMany) => {
    // Prevent additional documents from being inserted if one fails
    const options = { ordered: true };
    // Execute insert operation
    await Member.insertMany(objMany, options);
    return 'Created Many';
};

// PUT - Update a Member
const updateMember = async (id, obj) => {
    await Member.findByIdAndUpdate(id, obj);
    return 'Updated';
};

// DELETE - Delete a Member
const deleteMember = async (id) => {
    await Member.findByIdAndDelete(id);
    return 'Deleted';
};

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
    getAllMembers,
    getMemberById,
    addMember,
    addManyMembers,
    updateMember,
    deleteMember,
    getAllMembersWS
};