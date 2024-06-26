const express = require('express');
const usersBLL = require('../BLL/usersBLL');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

/*=======================================================================================================
/*==================================//* Work with - usersBLL.js *//*=====================================
/*============================//* CRUD - Create, Read, Update, Delete *//*===============================
/*=========================//* Entry Point:> http://localhost:8082/users *//*============================
/*=====================================================================================================*/

// Get All Users
router.get('/', verifyToken, async (req, res) => {
    try {
        const users = await usersBLL.getAllUsersAndPermissionsData();
        res.send(users);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// GET - Get User By Id
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await usersBLL.getUserAndPermissionDataByUserId(id);
        res.send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// GET - Get All Users and Messages By User Id
router.get(`/chats/:id`, verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const users = await usersBLL.getAllUsersAndMessagesByUserId(id);
        res.send(users);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// POST - Create a User
router.post('/', verifyToken, async (req, res) => {
    try {
        const obj = req.body; // In use        
        const result = await usersBLL.addUserAndDefaultPermissionData(obj);
        res.status(201).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// PUT - Update a User
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const obj = req.body;
        const result = await usersBLL.updateUserAndPermissionData(id, obj, { new: true });
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// DELETE - Delete a User
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await usersBLL.deleteUserAndPermissionData(id);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

module.exports = router;