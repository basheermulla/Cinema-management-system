const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const membersSchema = new Schema({
    name: { type: String, require: true },
    email: { type: String, require: true },
    city: { type: String, require: true },
    image: { type: String, require: true }
},
    { versionKey: false }
);

const Member = mongoose.model('member', membersSchema, 'members');

module.exports = Member;