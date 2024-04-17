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
const getChatsByBoth_UserLoginId_userId = async (userLoginId, userId) => {
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

    const res = Message.find(query).exec();
    const data = await res;

    const sortedData = data.sort(
        (a, b) => Number(a.created_at) - Number(b.created_at),
    );

    if (data.length > 0) {
        let currentDay = sortedData[0].created_at;

        const stillCurrentDay = (dayOfMessage) => {
            return dayOfMessage.getFullYear() === currentDay.getFullYear() &&
                dayOfMessage.getMonth() === currentDay.getMonth() &&
                dayOfMessage.getDate() === currentDay.getDate()
        }

        let dayMessageArray = [];
        const fullMessageArray = [];

        const createMessagesArray = (messages) => {
            const newDay = {};
            newDay[currentDay.toISOString().split('T')[0]] = messages;
            fullMessageArray.push(newDay);
        }

        sortedData.forEach(message => {
            if (!stillCurrentDay(message.created_at)) {
                createMessagesArray(dayMessageArray);
                currentDay = message.created_at;
                dayMessageArray = [];
            }

            dayMessageArray.push(message);
        });

        createMessagesArray(dayMessageArray);

        return fullMessageArray;
    }

    return data;
};

// POST - Create Message between two users
const addMessage = async (obj) => {
    console.log('mBLL[addMessage] = ', obj);
    console.log('mBLL[addMessage] = ', obj.converstationId);
    if (obj.converstationId === undefined || obj.converstationId === '') {
        const obj_conversation = {
            participants: [obj.sender, obj.recipient]
        }
        const conversation = new Conversation(obj_conversation)

        console.log('mBLL[addMessage][if (converstationId === undefined || "")] = ', conversation);
        
        await conversation.save();
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