const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    recipient: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, require: true },
    created_at: { type: Date, default: Date.now },
    converstationId: { type: Schema.Types.ObjectId, ref: 'Conversation' },
    isReadByRecipient: { type: Boolean, default: false }
},
    { versionKey: false }
);

const Message = mongoose.model('message', messageSchema, 'messages');

module.exports = Message;