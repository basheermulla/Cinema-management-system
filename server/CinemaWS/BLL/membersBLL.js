const MembersWS = require('../DAL/membersWS')

/*=======================================================================================================
/*==============================//* Work with - DAL/membersWS.js *//*====================================
/*====================//* Provided by:> "My Subscriptions REST API Server" *//*==========================
/*=====================================================================================================*/

// GET - Get All Members with the [Movies, Subscriptions] data
const getAllMembersAggregation = async () => {
    let { data: members } = await MembersWS.getAllMembersAggregationWS();
    return members;
}

// GET - Get All Members with Unwind Subscriptions [Movies, Subscriptions] data
const getAllMembersSubscriptionsUnwind = async () => {
    let { data: members } = await MembersWS.getAllMembersSubscriptionsUnwind();
    return members;
}

// GET - Get All Members
const getAllMembers = async () => {
    let { data: members } = await MembersWS.getAllMembersWS();
    return members;
}

// GET - Get Member By Id
const getMemberById = async (id) => {
    let { data: member } = await MembersWS.getMemberByIdWS(id);
    return member;
}

// POST - Create a Member
const addMember = async (obj) => {
    const { data: result } = await MembersWS.addMemberWS(obj);
    return result;
}

// PUT - Update a Member
const updateMember = async (id, obj) => {
    const { data: result } = await MembersWS.updateMemberWS(id, obj);
    return result;
}

// DELETE - Delete a Member
const deleteMember = async (id) => {
    const { data: result } = await MembersWS.deleteMemberWS(id);
    return result;
}

module.exports = { 
    getAllMembersAggregation,
    getAllMembersSubscriptionsUnwind,
    getAllMembers,
    getMemberById,
    addMember,
    updateMember,
    deleteMember,
}