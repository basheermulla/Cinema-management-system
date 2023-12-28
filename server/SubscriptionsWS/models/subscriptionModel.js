const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionsSchema = new Schema({
    memberId: { type: Schema.Types.ObjectId, ref: 'Member' },
    movies: [{
        movieId: { type: String, require: true },
        date: { type: String, require: true }
    }]
},
    { versionKey: false }
);

const Subscription = mongoose.model('subscription', subscriptionsSchema, 'subscriptions');

module.exports = Subscription;