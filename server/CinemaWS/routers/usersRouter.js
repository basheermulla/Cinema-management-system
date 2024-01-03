const express = require('express');
const usersBLL = require('../BLL/usersBLL');

const router = express.Router();

/*=======================================================================================================
/*==================================//* Work with - usersBLL.js *//*=====================================
/*============================//* CRUD - Create, Read, Update, Delete *//*===============================
/*=========================//* Entry Point:> http://localhost:8082/users *//*============================
/*=====================================================================================================*/

// Get All Users
router.get('/', async (req, res) => {
    try {
        const users = await usersBLL.getAllUsersAndPermissionsData();

        res.send(users);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// GET - Get User By Id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await usersBLL.getUserAndPermissionDataByUserId(id);
        res.send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// POST - Create a User
router.post('/', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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