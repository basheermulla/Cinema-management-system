const Movie = require('../models/movieModel.js');
const movieWS = require('../DAL/moviesWS');
const Subscription = require('../models/subscriptionModel.js');
const recommend = require('collaborative-filter');
const Member = require('../models/memberModel.js');

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
            // {
            //   $limit: 5
            // }
        ]
    ).exec();
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

    const respons = await Movie.find({ _id: { $in: movies } });

    return respons;
};

// GET - Get All Movies - Read
const getAllMovies = async () => {
    return Movie.find();
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

const filter = [{
    search: "Bi",
    sort: "low",
    type: ["Animation"],
    genres: [
        "Drama",
        "Science-Fiction",
        "Family"
    ],
    language: ["English", "Japanese", "Hebrew"],
    premiered: "Last 10 years",
    rating: 6.7
}]

const just_rating = {
    search: "",
    sort: "low",
    type: [],
    genres: [],
    language: [],
    premiered: "",
    rating: 4.6
}

const search111 = "Some text";
const sort112 = ["low", "high", "popularity", "type", "language"];

const type334 = ["Scripted", "Reality", "Animation"];
const genres5566 = [  // 21 options
    "All", "Drama", "Science-Fiction", "Thriller", "Action", "Crime", "Horror", "Romance", "Adventure", "Espionage", "Music", "Mystery", "Supernatural",
    "Fantasy", "Family", "Anime", "Comedy", "History", "Medical", "Legal", "Western"
];
const language7788 = ["English", "Japanese", "Hebrew"];
const premiered99876 = 2014; // Number
const rating89898 = 7.6; // Number

// POST - filter Movies by Multiple Conditions
const filterMovies = async (filter) => {
    const type_arr = filter.type;
    const genres_arr = filter.genres;
    const language_arr = filter.language;
    const premiered_year = filter.premiered;
    const rating_movie = filter.rating;

    const result = await Movie.aggregate(
        [
            {
                $match: {
                    $or: [
                        {
                            $expr: {
                                $switch: {
                                    branches: [
                                        {
                                            case: { $in: ["$type", type_arr] }, then: "$type"
                                        },
                                    ],
                                    default: {
                                        $and: [
                                            { $eq: [type_arr, []] },
                                            { $eq: [genres_arr, ["all"]] },
                                            { $eq: [language_arr, []] },
                                            { $eq: [premiered_year, ""] },
                                            { $eq: [rating_movie, 0] }
                                        ]
                                    }
                                }
                            }
                        },
                        {
                            $expr: {
                                $switch: {
                                    branches: [
                                        {
                                            case: { $in: ["$language", language_arr] }, then: "$language"
                                        },
                                    ],
                                    default: {
                                        $and: [
                                            { $eq: [type_arr, []] },
                                            { $eq: [genres_arr, ["all"]] },
                                            { $eq: [language_arr, []] },
                                            { $eq: [premiered_year, ""] },
                                            { $eq: [rating_movie, 0] }
                                        ]
                                    }
                                }
                            }
                        },
                        {
                            $expr: {
                                $switch: {
                                    branches: [
                                        {
                                            case: { $not: { $eq: [{ $setIntersection: ["$genres", genres_arr] }, []] } }, then: "$genres"
                                        },
                                    ],
                                    default: {
                                        $and: [
                                            { $eq: [type_arr, []] },
                                            { $eq: [genres_arr, ["all"]] },
                                            { $eq: [language_arr, []] },
                                            { $eq: [premiered_year, ""] },
                                            { $eq: [rating_movie, 0] }
                                        ]
                                    }
                                }
                            }
                        },
                        {
                            $expr: {
                                $switch: {
                                    branches: [
                                        {
                                            case: {
                                                $and: [
                                                    { $gte: [{ $year: "$premiered" }, +premiered_year] },
                                                    {
                                                        $gte: ["$premiered", {
                                                            $dateSubtract: {
                                                                startDate: "$$NOW",
                                                                unit: "year",
                                                                amount: 30
                                                            }
                                                        }]
                                                    },
                                                    { $ne: [premiered_year, "Over 31 years"] },
                                                    { $ne: [premiered_year, ""] }
                                                ]
                                            }, then: "$premiered"
                                        },
                                        {
                                            case: {
                                                $and: [
                                                    { $eq: [premiered_year, "Over 31 years"] },
                                                    { $gte: [{ $subtract: [{ $year: new Date() }, { $year: "$premiered" }] }, 31] }
                                                ]
                                            }, then: "$premiered"
                                        }
                                    ],
                                    default: {
                                        $and: [
                                            { $eq: [type_arr, []] },
                                            { $eq: [genres_arr, ["all"]] },
                                            { $eq: [language_arr, []] },
                                            { $eq: [premiered_year, ""] },
                                            { $eq: [rating_movie, 0] }
                                        ]
                                    }
                                }
                            }
                        },
                        {
                            $expr: {
                                $switch: {
                                    branches: [
                                        {
                                            case: {
                                                $and: [
                                                    { $gte: ["$rating", rating_movie] },
                                                    { $ne: [rating_movie, 0] }
                                                ]                                                
                                            }, then: "$rating"
                                        },
                                    ],
                                    default: {
                                        $and: [
                                            { $eq: [type_arr, []] },
                                            { $eq: [genres_arr, ["all"]] },
                                            { $eq: [language_arr, []] },
                                            { $eq: [premiered_year, ""] },
                                            { $eq: [rating_movie, 0] }
                                        ]
                                    }
                                }
                            }
                        }
                    ]
                }
            },
            // {
            //     $lookup:
            //     {
            //         from: 'subscriptions',
            //         let: { id: "$_id" },
            //         pipeline: [
            //             {
            //                 $project:
            //                 {
            //                     memberId: 1,
            //                     subscriptionMovies: {
            //                         $filter: {
            //                             input: "$subscriptionMovies",
            //                             cond: { $eq: ["$$movie.movieId", "$$id"] },
            //                             as: "movie"
            //                         }
            //                     }
            //                 }

            //             }
            //         ],
            //         as: "subscriptionWatched"
            //     }
            // },
            // {
            //     $project:
            //     {
            //         name: 1,
            //         type: 1,
            //         language: 1,
            //         summary: 1,
            //         image: 1,
            //         genres: 1,
            //         premiered: 1,
            //         rating: 1,
            //         subscriptionWatched: {
            //             $filter: {
            //                 input: "$subscriptionWatched",
            //                 as: "subscription",
            //                 cond: {
            //                     $and: [
            //                         { $ne: ["$$subscription.subscriptionMovies", []] },
            //                     ]
            //                 }
            //             }
            //         }
            //     }
            // },
            // {
            //     $lookup:
            //     {
            //         from: "members",
            //         localField: "subscriptionWatched.memberId",
            //         foreignField: "_id",
            //         as: "members"
            //     }
            // },
            // {
            //     $addFields: {
            //         subscriptionWatched: {
            //             $map: {
            //                 input: "$subscriptionWatched",
            //                 as: "i",
            //                 in: {
            //                     $mergeObjects: [
            //                         "$$i",
            //                         {
            //                             $arrayElemAt: [
            //                                 {
            //                                     $filter: {
            //                                         input: "$members",
            //                                         cond: { $eq: ["$$this._id", "$$i.memberId"] }
            //                                     }
            //                                 },
            //                                 0
            //                             ]
            //                         }
            //                     ]
            //                 }
            //             }
            //         },
            //         members: "$$REMOVE"
            //     }
            // },
            // {
            //     $project:
            //     {
            //         name: 1,
            //         type: 1,
            //         language: 1,
            //         summary: 1,
            //         image: 1,
            //         genres: 1,
            //         premiered: 1,
            //         rating: 1,
            //         subscriptionWatched: {
            //             $map: {
            //                 input: "$subscriptionWatched",
            //                 as: "member",
            //                 in: {
            //                     memberId: "$$member.memberId",
            //                     name: "$$member.name",
            //                     email: "$$member.email",
            //                     city: "$$member.city",
            //                     image: "$$member.image",
            //                     dates: "$$member.subscriptionMovies.date"
            //                 }
            //             }
            //         }
            //     }
            // }
        ]
    ).exec();
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
    getMovieByIdWithSubscriptions,
    getMovieById,
    addMovie,
    filterMovies,
    addManyMovies,
    updateMovie,
    deleteMovie,
    getAllMoviesWS
};