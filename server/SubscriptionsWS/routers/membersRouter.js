const express = require('express');
const membersBLL = require('../BLL/membersBLL');

const router = express.Router();

/*=======================================================================================================
/*================================//* Work with - membersBLL.js *//*=====================================
/*============================//* CRUD - Create, Read, Update, Delete *//*===============================
/*=========================//* Entry Point:> http://localhost:8080/members *//*==========================
/*=====================================================================================================*/

// Get All Members with the widthly data by use MongoDB aggregation pipeline - Read
router.get('/aggregate', async (req, res) => {
    try {
        const members = await membersBLL.getAllMembersAggregation();
        
        res.send(members);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// Get All Members
router.get('/', async (req, res) => {
    try {
        const members = await membersBLL.getAllMembers();

        res.send(members);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// GET - Get Member By Id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const member = await membersBLL.getMemberById(id);
        res.send(member);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// POST - Create a Member
router.post('/', async (req, res) => {
    try {
        const obj = req.body; // In use
        console.log('Post New Member = ', obj)
        const result = await membersBLL.addMember(obj);
        res.status(201).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// PUT - Update a Member
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const obj = req.body;
        const result = await membersBLL.updateMember(id, obj, { new: true });
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// DELETE - Delete a Member
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await membersBLL.deleteMember(id);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

module.exports = router;