const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moviesSchema = new Schema({
    name: { type: String, require: true },
    type: { type: String, require: true },
    language: { type: String, require: true },
    summary: { type: String, require: true },
    image: {
        medium: { type: String, require: true },
        original: { type: String, require: true }
    },
    genres: [{ type: String, require: true }],
    premiered: { type: Date, require: true },
    rating: { type: Number, require: true }
},
    { versionKey: false }
);

// Create a compound index on the 'type' and 'language' and 'genres' and 'premiered' and 'rating' fields
moviesSchema.index({ type: 1, language: 1, premiered: 1, rating: 1 });

const Movie = mongoose.model('movie', moviesSchema, 'movies');

module.exports = Movie;