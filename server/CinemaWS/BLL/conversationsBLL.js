const Conversation = require('../models/conversationModel.js');

/*=======================================================================================================
/*==============================//* Conversations Collection MongoDB *//*================================
/*================================//* CRD - Create, Read, Delete *//*====================================
/*=====================================================================================================*/

// GET - Get All Conversations - Read
const getAllConversations = async () => {
    return Conversation.find();
};

// GET - Get Conversations By Id - Read
const getConversationById = (id) => {
    return Conversation.findById({ _id: id });
};

// POST - Create Conversation between two users
const addConversation = async (obj) => {
    console.log(obj);
    const conversation = new Conversation(obj);
    await conversation.save();
    return 'Created';
};

// DELETE - Delete a Conversation
const deleteConversation = async (id) => {
    const res = await Conversation.deleteOne(id);
    //****************************************************** */
    // Delete related messages   ------------- todo --------**/
    //****************************************************** */
    return 'Deleted';
};

module.exports = {
    getAllConversations,
    getConversationById,
    addConversation,
    deleteConversation,
};