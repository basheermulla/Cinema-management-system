const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }]
},
    { versionKey: false }
);

const Conversation = mongoose.model('conversation', conversationSchema, 'conversations');

module.exports = Conversation;