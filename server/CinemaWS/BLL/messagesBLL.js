const Message = require('../models/messageModel.js');
const Conversation = require('../models/conversationModel.js');

/*=======================================================================================================
/*================================//* Messages Collection MongoDB *//*===================================
/*============================//* CRUD - Create, Read, Update, Delete *//*===============================
/*=====================================================================================================*/

// GET - Get All Messages - Read
const getAllMessages = async () => {
    return Message.find()
};

// GET - Get Messages By Id - Read
const getMessageById = (id) => {
    return Message.findById({ _id: id })
};

// GET - Get Chats between two users - by [userLoginId, userId]
const getChatsByBoth_UserLoginId_userId = (userLoginId, userId) => {
    const query = {
        $or: [
            {
                $and: [
                    { "sender": userLoginId },
                    { "recipient": userId }
                ]
            },
            {
                $and: [
                    { "sender": userId },
                    { "recipient": userLoginId }
                ]
            }
        ]
    }

    return Message.find(query).exec();
};

// POST - Create Message between two users
const addMessage = async (obj) => {
    if (obj.converstationId === undefined) {
        console.log(obj.sender, obj.recipient);
        const obj_conversation = {
            participants: [obj.sender, obj.recipient]
        }
        console.log(obj_conversation);
        const conversation = await new Conversation(obj_conversation)
        await conversation.save();
        console.log(conversation);
        const message = new Message({ ...obj, converstationId: conversation._id });
        await message.save();
        return message;
    }

    const message = new Message(obj);
    await message.save();
    return message;
};

// PUT - Update a Message
const updateMessage = async (id, obj, options) => {
    await Message.findByIdAndUpdate(id, obj, options);
    return 'Updated';
};

// PUT - Update Read chats by user (recipient)
const updateReadChatsByUser = async (userLoginId, userId) => {
    const filter = {
        $and: [
            { "sender": userId },
            { "recipient": userLoginId }
        ]
    }
    const update = { $set: { "isReadByRecipient": true } }

    await Message.updateMany(filter, update);
    return 'Updated';
};

// DELETE - Delete a Message
const deleteMessage = async (id) => {
    const res = await Message.deleteOne(id);
    return 'Deleted';
};

module.exports = {
    getAllMessages,
    getMessageById,
    getChatsByBoth_UserLoginId_userId,
    addMessage,
    updateMessage,
    updateReadChatsByUser,
    deleteMessage
};