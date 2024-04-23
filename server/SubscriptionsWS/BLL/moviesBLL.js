const Movie = require('../models/movieModel.js');
const movieWS = require('../DAL/moviesWS');
const Subscription = require('../models/subscriptionModel.js');
const recommend = require('collaborative-filter');
const Member = require('../models/memberModel.js');
const _ = require('lodash');

/*=======================================================================================================
/*================================//* Movies Collection MongoDB *//*=====================================
/*============================//* CRUD - Create, Read, Update, Delete *//*===============================
/*=====================================================================================================*/

// GET - Get All Movies with the widthly data by use MongoDB aggregation pipeline - Read
const getAllMoviesAggregation = async () => {
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
                    rating: 1,
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
                    rating: 1,
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

// GET - Get All popular movies by [number of subscriptions] - Read
const getAllPopularMovies = async () => {
    const result = await Movie.aggregate(
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
                    rating: 1,
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
                $project:
                {
                    name: 1,
                    type: 1,
                    language: 1,
                    summary: 1,
                    image: 1,
                    genres: 1,
                    premiered: 1,
                    rating: 1,
                    subscriptionWatched: {
                        $map: {
                            input: "$subscriptionWatched",
                            as: "member",
                            in: {
                                memberId: "$$member.memberId",
                                subscription_count: {
                                    $size: "$$member.subscriptionMovies"
                                }
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    total_subscriptions: {
                        $sum: {
                            $map: {
                                input: "$subscriptionWatched",
                                as: "subscription",
                                in: "$$subscription.subscription_count",
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    subscriptionWatched: 0
                }
            },
            {
                $sort: { total_subscriptions: -1 }
            },
            {
                $limit: 5
            }
        ]
    ).exec();

    let data = {};

    data.popular_movies = result;

    try {
        const count = await Movie.countDocuments({});
        data.countMovie = count;
    } catch (err) {
        console.error(err);
    }

    return data;
};

// GET - Get Related Movies by User Id - Read
const getRelatedMovies = async (memberId) => {
    const result = await Member.aggregate(
        [
            {
                $lookup:
                {
                    from: 'subscriptions',
                    let: { "id": '$_id' },
                    pipeline: [
                        {
                            $match: { $expr: { $eq: ["$$id", "$memberId"] } }
                        },
                        {
                            $addFields: { subscriptionMovies: { isSubscribe: 1 } }
                        },
                    ], as: "subscriptions"
                }
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $cond: {
                            if: {
                                $eq: [
                                    {
                                        $ifNull: [
                                            "$subscriptions",
                                            []
                                        ]
                                    },
                                    []
                                ]
                            },
                            then: {
                                $mergeObjects: [{ memberId: "$_id" }, "$$ROOT"]
                            },
                            else: {
                                $mergeObjects: [{ $arrayElemAt: ["$subscriptions", 0] }, "$$ROOT"]
                            }
                        }
                    }
                }
            },
            {
                $project:
                {
                    _id: 0,
                    memberId: 1,
                    subscriptions: { $ifNull: ["$subscriptionMovies", []] }
                }
            },
            {
                $project: {
                    memberId: 1,
                    subscriptions: {
                        $reduce: {
                            input: "$subscriptions",
                            initialValue: [],
                            in: {
                                $cond: [
                                    { $in: ["$$this.movieId", "$$value.movieId"] }, /** Check if 'id' exists in holding array if yes push same array or concat holding array with & array of new object */
                                    "$$value",
                                    { $concatArrays: ["$$value", ["$$this"]] }
                                ]
                            }
                        }
                    }

                }
            },
            {
                $project:
                {
                    memberId: 1,
                    subscriptions: {
                        $map: {
                            input: "$subscriptions",
                            as: "movie",
                            in: {
                                movieId: "$$movie.movieId",
                                isSubscribe: "$$movie.isSubscribe",
                            }
                        }
                    }
                }
            },
            {
                $lookup:
                {
                    from: 'movies',
                    let: { "id": '$subscriptions.movieId' },
                    pipeline: [
                        {
                            $addFields: {
                                movieId: "$_id",
                                isSubscribe: 0
                            }
                        },
                        {
                            $project:
                            {
                                _id: 0,
                                movieId: 1,
                                isSubscribe: 1
                            }
                        },
                    ], as: "movies"
                }
            },
            {
                $project: {
                    memberId: 1,
                    subscriptions: 1,
                    movies: {
                        $reduce: {
                            input: "$movies",
                            initialValue: [],
                            in: {
                                $cond: [
                                    { $in: ["$$this.movieId", "$$value.movieId"] }, /** Check if 'id' exists in holding array if yes push same array or concat holding array with & array of new object */
                                    "$$value",
                                    {
                                        $concatArrays: [
                                            "$$value",
                                            {
                                                $cond: [{ $in: ["$$this.movieId", "$subscriptions.movieId"] }, [], ["$$this"],]
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $project:
                {
                    memberId: 1,
                    subscriptions: { $concatArrays: ["$subscriptions", "$movies"] }
                }
            },
        ])

    const matrix = result.map(({ memberId, subscriptions }) => {
        const row_Memebe = subscriptions.map((movie) => (movie.isSubscribe))
        return row_Memebe;
    });

    const movies_indexes = result[0].subscriptions.map((movie, index) => (movie.movieId));
    const memberId_index = result.findIndex((member) => member.memberId.toHexString() === memberId);
    const recommendations = recommend.cFilter(matrix, memberId_index);

    const movies = recommendations.map((index) => (movies_indexes[index]))
    const ids = movies.filter((movies, index) => index < 5);
    const respons = await Movie.find({ _id: { $in: ids } });

    return respons;
};

// GET - Get All Movies - Read
const getAllMovies = async () => {
    return Movie.find();
};

// Get All Movies per number of a current page and amount movies per page
const getMoviesPerPage = async (page, perPage) => {
    const startIndex = (page - 1) * perPage; // Calculate the starting index for the page
    // Check the length of the collection conditionally
    return Movie.countDocuments({})
        .then(async (count) => {
            // Calculate and return the total number of pages based on the page size
            const totalPages = Math.ceil(count / perPage);

            const movies = await Movie.find({})
                .skip(startIndex) // Skip documents before the starting index
                .limit(perPage) // Limit the number of documents per page 

            return { movies, totalPages };
        });
};

// GET - Get countDocuments of Movies colliction - Read
const getCountPagesMovies = (perPage) => {
    // Check the length of the collection conditionally
    return Movie.countDocuments({})
        .then(count => {
            // Calculate and return the total number of pages based on the page size
            const totalPages = Math.ceil(count / perPage);
            return totalPages;
        });
};

// GET - Get Movie By Id With Subscription - Read
const getMovieByIdWithSubscriptions = (movieId) => {
    return Movie.aggregate(
        [
            {
                $match: { $expr: { $eq: ["$_id", { $toObjectId: movieId }] } }
            },
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
                    rating: 1,
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
                    rating: 1,
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

// POST - filter Movies by Multiple Conditions
const filterMovies = async (filter) => {
    const typeValues = filter.type;
    const languageValues = filter.language;
    const genresValues = filter.genres;
    const selectedPremiereOption = filter.premiered;
    const rating_movie = filter.rating;
    const page = filter.page
    const perPage = filter.perPage

    const query = {
        $or: []
    };

    if (typeValues.length > 0) {
        query.$or.push({ type: { $in: typeValues } });
    }

    if (languageValues.length > 0) {
        query.$or.push({ language: { $in: languageValues } });
    }

    if (genresValues[0] !== 'all' && genresValues.length > 0) {
        query.$or.push({ genres: { $in: genresValues } });
    }

    const currentYear = new Date().getFullYear();
    switch (selectedPremiereOption) {
        case "Last 5 years":
            query.$or.push({ premiered: { $gte: new Date(currentYear - 5, 0, 1) } });
            break;
        case "Last 10 years":
            query.$or.push({ premiered: { $gte: new Date(currentYear - 10, 0, 1) } });
            break;
        case "Last 15 years":
            query.$or.push({ premiered: { $gte: new Date(currentYear - 15, 0, 1) } });
            break;
        case "Last 20 years":
            query.$or.push({ premiered: { $gte: new Date(currentYear - 20, 0, 1) } });
            break;
        case "Last 30 years":
            query.$or.push({ premiered: { $gte: new Date(currentYear - 30, 0, 1) } });
            break;
        case "Over 31 years":
            query.$or.push({ premiered: { $lt: new Date(currentYear - 30, 0, 1) } });
            break;
        case "Reset time periods":
            // No specific date range, include all premiered movies
            break;
        default:
        // Handle default case or error
    }

    const selectedRating = { min: rating_movie, max: 10 }; // Replace with the selected rating range

    // Add condition for rating
    if (rating_movie > 0) {
        query.$or.push({ rating: { $gte: selectedRating.min, $lte: selectedRating.max } });
    }

    const startIndex = 0; // Calculate the starting index for the page
    let result = [];
    // Return the filtered movies
    if (!_.isEqual(query, { $or: [] })) {
        result = await Movie.find(query)
            .sort({ $natural: 1 })
            .skip(startIndex) // Skip documents before the starting index
            .limit(page * perPage) // Limit the number of documents per page 
    } else {
        result = await Movie.find({})
            .sort({ $natural: 1 })
            .skip(startIndex) // Skip documents before the starting index
            .limit(page * perPage) // Limit the number of documents per page 
    }

    return result;
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
    return movies;
};

module.exports = {
    getAllMoviesAggregation,
    getAllPopularMovies,
    getRelatedMovies,
    getAllMovies,
    getMoviesPerPage,
    getCountPagesMovies,
    getMovieByIdWithSubscriptions,
    getMovieById,
    addMovie,
    filterMovies,
    addManyMovies,
    updateMovie,
    deleteMovie,
    getAllMoviesWS
};