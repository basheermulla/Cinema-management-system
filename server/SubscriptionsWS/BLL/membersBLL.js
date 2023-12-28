const Member = require('../models/memberModel.js');

/*=======================================================================================================
/*================================//* Members Collection MongoDB *//*====================================
/*================================//* Work with - membersDAL.js *//*====================================
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

module.exports = {
    getAllMembers,
    getMemberById,
    addMember,
    updateMember,
    deleteMember
};