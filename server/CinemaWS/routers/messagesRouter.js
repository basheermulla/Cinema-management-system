const express = require('express');
const messagesBLL = require('../BLL/messagesBLL');
const conversationsBLL = require('../BLL/conversationsBLL');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

/*=======================================================================================================
/*==================================//* Work with - messagesBLL.js *//*=====================================
/*============================//* CRUD - Create, Read, Update, Delete *//*===============================
/*=========================//* Entry Point:> http://localhost:8082/messages *//*============================
/*=====================================================================================================*/

// Get All Messages
router.get('/', verifyToken, async (req, res) => {
    try {
        const message = await messagesBLL.getAllMessages();
        
        res.send(message);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// GET - Get Message By Id
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(req.params);
        const message = await messagesBLL.getMessageById(id);
        res.send(message);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// GET - Get Chats between two users - by [userLoginId, userId]
router.get('/:userLoginId/:userId', verifyToken, async (req, res) => {
    try {
        const { userLoginId, userId } = req.params;
        
        const messages = await messagesBLL.getChatsByBoth_UserLoginId_userId(userLoginId, userId);
        // console.log('messages = ', messages);
        res.send(messages);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// POST - Create a Message
router.post('/', verifyToken, async (req, res) => {
    try {
        const obj = req.body; // In use
              
        const result = await messagesBLL.addMessage(obj);
        res.status(201).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// PUT - Update a Message
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const obj = req.body;
        const result = await messagesBLL.updateMessage(id, obj, { new: true });
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// PUT - Update Read chats by user (recipient)
router.put('/:userLoginId/:userId', verifyToken, async (req, res) => {
    try {
        const { userLoginId, userId } = req.params;
        console.log(req.params);
        const result = await messagesBLL.updateReadChatsByUser(userLoginId, userId);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// DELETE - Delete a Message
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await messagesBLL.deleteMessage(id);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

module.exports = router;