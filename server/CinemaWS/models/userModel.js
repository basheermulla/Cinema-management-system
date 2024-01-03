const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    username: { type: String, require: true },
    password: { type: String, require: true },
},
    { versionKey: false }
);

const User = mongoose.model('user', usersSchema, 'users');

module.exports = User;