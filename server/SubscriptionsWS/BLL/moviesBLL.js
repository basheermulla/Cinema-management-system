const Movie = require('../models/movieModel.js');
const movieWS = require('../DAL/moviesWS');
const Subscription = require('../models/subscriptionModel.js');

/*=======================================================================================================
/*================================//* Movies Collection MongoDB *//*=====================================
/*============================//* CRUD - Create, Read, Update, Delete *//*===============================
/*=====================================================================================================*/

// GET - Get All Movies with the widthly data by use MongoDB aggregation pipeline - Read
const getAllMoviesAggregation = async () => {
    console.log('Hello from getAllMoviesAggregation');
    return Movie.aggregate(
        [
            {
                $lookup:
                {
                    from: 'subscriptions',
                    let: { id: "$_id" },
                    pipeline: [
                        {
                            $project:
                            {
                                memberId: 1,
                                subscriptionMovies: {
                                    $filter: {
                                        input: "$subscriptionMovies",
                                        cond: { $eq: ["$$movie.movieId", "$$id"] },
                                        as: "movie"
                                    }
                                }
                            }

                        }
                    ],
                    as: "subscriptionWatched"
                }
            },
            {
                $project:
                {
                    name: 1,
                    type: 1,
                    language: 1,
                    summary: 1,
                    image: 1,
                    genres: 1,
                    premiered: 1,
                    subscriptionWatched: {
                        $filter: {
                            input: "$subscriptionWatched",
                            as: "subscription",
                            cond: {
                                $and: [
                                    { $ne: ["$$subscription.subscriptionMovies", []] },
                                ]
                            }
                        }
                    }
                }
            },
            {
                $lookup:
                {
                    from: "members",
                    localField: "subscriptionWatched.memberId",
                    foreignField: "_id",
                    as: "members"
                }
            },
            {
                $addFields: {
                    subscriptionWatched: {
                        $map: {
                            input: "$subscriptionWatched",
                            as: "i",
                            in: {
                                $mergeObjects: [
                                    "$$i",
                                    {
                                        $arrayElemAt: [
                                            {
                                                $filter: {
                                                    input: "$members",
                                                    cond: { $eq: ["$$this._id", "$$i.memberId"] }
                                                }
                                            },
                                            0
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                    members: "$$REMOVE"
                }
            },
            {
                $project:
                {
                    name: 1,
                    type: 1,
                    language: 1,
                    summary: 1,
                    image: 1,
                    genres: 1,
                    premiered: 1,
                    subscriptionWatched: {
                        $map: {
                            input: "$subscriptionWatched",
                            as: "member",
                            in: {
                                memberId: "$$member.memberId",
                                name: "$$member.name",
                                email: "$$member.email",
                                city: "$$member.city",
                                image: "$$member.image",
                                dates: "$$member.subscriptionMovies.date"
                            }
                        }
                    }
                }
            }
        ]
    ).exec();
};

// GET - Get All Movies - Read
const getAllMovies = async () => {
    return Movie.find();
};

// GET - Get Movie By Id - Read
const getMovieById = (id) => {
    return Movie.findById({ _id: id })
};

// POST - Create a Movie
const addMovie = async (obj) => {
    const movie = new Movie(obj);
    await movie.save();
    return 'Created';
};

// PUT - Update a Movie
const updateMovie = async (id, obj, options) => {
    await Movie.findByIdAndUpdate(id, obj, options);
    return 'Updated';
};

// DELETE - Delete a Movie
const deleteMovie = async (id) => {
    await Movie.findByIdAndDelete(id);
    await Subscription.updateMany({}, { $pull: { subscriptionMovies: { movieId: id } } });
    await Subscription.deleteMany({ subscriptionMovies: { $exists: true, $size: 0 } });
    return 'Deleted';
};

//====================================================================
//=     Working only once, when the Subscriptions server starting    =
//====================================================================

// InsertMany - Insert multiple Movies
const addManyMovies = async (objMany) => {
    // Prevent additional documents from being inserted if one fails
    const options = { ordered: true };
    // Execute insert operation
    await Movie.insertMany(objMany, options);
    return 'Created Many';
};
//====================================================================

/*=======================================================================================================
/*===============================//* Work with - DAL/moviesWS.js *//*====================================
/*============================//* Get - All movies from external WS *//*=================================
/*========================//* Entry Point:> https://api.tvmaze.com/shows *//*============================
/*=====================================================================================================*/

// GET - Get All Members - Read
const getAllMoviesWS = async (id = '') => {
    const { data: movies } = await movieWS.getAllMoviesWS(id);    //From WS
    // console.log('movies = ', movies);
    return movies;
};

module.exports = {
    getAllMoviesAggregation,
    getAllMovies,
    getMovieById,
    addMovie,
    addManyMovies,
    updateMovie,
    deleteMovie,
    getAllMoviesWS
};