const Member = require('../models/memberModel.js');
const memberWS = require('../DAL/membersWS');

/*=======================================================================================================
/*================================//* Members Collection MongoDB *//*====================================
/*============================//* CRUD - Create, Read, Update, Delete *//*===============================
/*=====================================================================================================*/

// GET - Get All Members - Read
const getAllMembers = async () => {
    return Member.find()
};

// GET - Get Member By Id - Read
const getMemberById = (id) => {
    return Member.findById({ _id: id })
};

// POST - Create a Member
const addMember = async (obj) => {
    const member = new Member(obj);
    await member.save();
    return 'Created';
};

// InsertMany - Insert multiple Members
const addManyMembers = async (objMany) => {
    // Prevent additional documents from being inserted if one fails
    const options = { ordered: true };
    // Execute insert operation
    await Member.insertMany(objMany, options);
    return 'Created Many';
};

// PUT - Update a Member
const updateMember = async (id, obj) => {
    await Member.findByIdAndUpdate(id, obj);
    return 'Updated';
};

// DELETE - Delete a Member
const deleteMember = async (id) => {
    await Member.findByIdAndDelete(id);
    return 'Deleted';
};

/*=======================================================================================================
/*==============================//* Work with - DAL/membersWS.js *//*====================================
/*===========================//* Get - All members from external WS *//*=================================
/*================//* Entry Point:> https://jsonplaceholder.typicode.com/users *//*======================
/*=====================================================================================================*/

// GET - Get All Members - Read
const getAllMembersWS = async (amount = '') => {
    const { data: members } = await memberWS.getAllMembersWS(amount);    //From WS

    return members;
};

module.exports = {
    getAllMembers,
    getMemberById,
    addMember,
    addManyMembers,
    updateMember,
    deleteMember,
    getAllMembersWS
};