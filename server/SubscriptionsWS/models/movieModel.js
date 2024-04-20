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

// Indexes
moviesSchema.index({ name: 1 });
moviesSchema.index({ type: 1 });
moviesSchema.index({ language: 1 });
moviesSchema.index({ genres: 1 });
moviesSchema.index({ premiered: 1 });
moviesSchema.index({ rating: 1 });

const Movie = mongoose.model('movie', moviesSchema, 'movies');

module.exports = Movie;