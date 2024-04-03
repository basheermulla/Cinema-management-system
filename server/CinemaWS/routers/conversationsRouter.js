const express = require('express');
const conversationsBLL = require('../BLL/conversationsBLL');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

/*=======================================================================================================
/*==================================//* Work with - conversationsBLL.js *//*=====================================
/*============================//* CRUD - Create, Read, Update, Delete *//*===============================
/*=========================//* Entry Point:> http://localhost:8082/conversations *//*============================
/*=====================================================================================================*/

// Get All Conversations
router.get('/', verifyToken, async (req, res) => {
    try {
        const conversations = await conversationsBLL.getAllConversations();
        
        res.send(conversations);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// GET - Get Conversation By Id
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const conversation = await conversationsBLL.getConversationById(id);
        res.send(conversation);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// POST - Create a Conversation
router.post('/', verifyToken, async (req, res) => {
    try {
        const obj = req.body; // In use
        const result = await conversationsBLL.addConversation(obj);
        res.status(201).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// DELETE - Delete a Conversation
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await conversationsBLL.deleteConversation(id);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

module.exports = router;