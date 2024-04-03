const usersFile = require('../DAL/usersFile');
const permissionsFile = require('../DAL/permissionsFile');
const User = require('../models/userModel');

/*=======================================================================================================
/*=================//* Work against jsonfiles [permissions.json, users.json] *//*========================
/*========================//* Work against mongoDB Users Collection *//*=================================
/*=========================//*  CRUD - Create, Read, Update, Delete *//*=================================
/*=====================================================================================================*/

// GET - Get All Users and Permissions
const getAllUsersAndPermissionsData = async () => {
    // Get username from mongoDB Users Collection
    const users = await User.find();
    // Read users and permissions json file
    let usersData = await usersFile.getUsersFile();
    const permissionsData = await permissionsFile.getPermissionsFile();

    // Map the users with their permissions
    const mapUsers = usersData.users.map((user) => {
        const getUserPermissions = permissionsData.permissions.find((permission) => permission.id === user.id);
        const userDB = users.find((u) => u['_id'].toHexString() === user.id);
        obj_user = {
            _id: user.id,
            username: userDB?.username,
            user: user,
            permissionsUser: getUserPermissions
        }
        return obj_user;
    });

    return mapUsers;
}

// GET - Get User and Permission By User Id
const getUserAndPermissionDataByUserId = async (id) => {
    // Get username from mongoDB Users Collection
    const { _id, username } = await User.findById({ _id: id });

    // Read users and permissions json file
    const users = await usersFile.getUsersFile();
    const permissions = await permissionsFile.getPermissionsFile();

    // Find the desire user and its permissions
    let user = users.users.find((user) => user.id === id);
    const getUserPermission = permissions.permissions.find((permission) => permission.id === id);

    // Map the desire user with its username and permissions
    obj_user = {
        _id: _id,
        username: username,
        user: user,
        permissionsUser: getUserPermission
    }

    return obj_user;
}

// GET - Get All Users and Messages By User Id
const getAllUsersAndMessagesByUserId = async (id) => {
    // Get username from mongoDB Users Collection
    const users = await User.aggregate(
        [
            {
                $match: { $expr: { $ne: ["$_id", { $toObjectId: id }] } }
            },
            {
                $project: { password: 0 }
            },
            {
                $lookup:
                {
                    from: 'conversations',
                    let: { "id": '$_id' },
                    pipeline: [
                        {
                            $match:
                            {
                                $expr:
                                {
                                    $and: [
                                        { $in: [{ $toObjectId: id }, "$participants"] },
                                        { $in: ["$$id", "$participants"] }
                                    ]
                                }
                            }
                        },
                        {
                            $addFields:
                            {
                                conversationId: "$_id",
                            }
                        }
                    ], as: "myparticipants"
                }
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$myparticipants", 0] }, "$$ROOT"] } }
            },
            {
                $project: { myparticipants: 0 }
            },
            {
                $lookup:
                {
                    from: "messages",
                    localField: "conversationId",
                    foreignField: "converstationId",
                    as: "messages",
                }
            },
            {
                $addFields: {
                    unReadChatCount: {
                        $sum: {
                            $map: {
                                input: {
                                    $filter: {
                                        input: "$messages",
                                        as: "message_recipient",
                                        cond: { $eq: ['$$message_recipient.recipient', { $toObjectId: id }] }
                                    }
                                },
                                as: 'message',
                                in: {
                                    $cond: ["$$message.isReadByRecipient", 0, 1]
                                },
                            }
                        }
                    },
                },
            },
            {
                $addFields: {
                    lastMessage: {
                        $max: {
                            $map: {
                                input: '$messages',
                                as: 'message',
                                in: "$$message.created_at"
                            }
                        }
                    },
                },
            },
            {
                $project: { messages: 0 }
            },
        ]
    ).exec();

    // Accept the users as asynchronous to give us the ability to work with them
    const resp_users = await users;

    // Read users and permissions json file
    let usersData = await usersFile.getUsersFile();
    const permissionsData = await permissionsFile.getPermissionsFile();

    // Map the users with their permissions
    const mapUsers = usersData.users.filter((u) => u.id !== id).map((user) => {
        const userDB = resp_users.find((u) => u['_id'].toHexString() === user.id);
        obj_user = {
            ...userDB,
            user: user,
        }
        return obj_user;
    });

    return mapUsers;
}


// POST - Create a User and Default Permission
const addUserAndDefaultPermissionData = async (obj) => {
    // Extract received data regarding the new user 
    const { username, user, permissionsUser } = obj

    // Create username without password into mongoDB Users Collection
    const obj_username = { username: username };
    const userDB = new User(obj_username);
    const resp = await userDB.save();

    // Write users to users json file with the new user
    const usersData = await usersFile.getUsersFile();
    const obj_user = { id: resp._id, ...user, published: Date.now() };
    usersData.users.push(obj_user);
    await usersFile.setUsersFile(usersData);

    // Write permissions to permissions json file with the new user's permission
    const permissionsData = await permissionsFile.getPermissionsFile();
    const obj_permission = { id: resp._id, ...permissionsUser };
    permissionsData.permissions.push(obj_permission);
    await permissionsFile.setPermissionsFile(permissionsData);

    return 'Created';
}

// PUT - Update a User and Permission
const updateUserAndPermissionData = async (id, obj, options) => {
    // Extract received data regarding the user's updating 
    const { username, user, permissionsUser } = obj

    // Update username without password into mongoDB Users Collection
    if (username) {
        await User.findByIdAndUpdate(id, { username: username }, options);
    }

    // Read and Write users to users json file with the user changes
    if (user) {
        const usersData = await usersFile.getUsersFile();
        const userIndex = usersData.users.findIndex((user) => user.id === id);
        usersData.users[userIndex] = { ...user };
        await usersFile.setUsersFile(usersData);
    }

    // Read and Write permissions to permissions json file with the user changes
    if (permissionsUser) {
        const permissionsData = await permissionsFile.getPermissionsFile();
        const permissionIndex = permissionsData.permissions.findIndex((permission) => permission.id === id);
        permissionsData.permissions[permissionIndex] = { ...permissionsUser };
        await permissionsFile.setPermissionsFile(permissionsData);
    }

    return 'Updated';
}

// DELETE - Delete a User and Permission
const deleteUserAndPermissionData = async (id) => {
    // Delete user [username and password] from mongoDB Users Collection
    await User.findByIdAndDelete(id);

    // Write users to users json file after deleting the desire user
    const usersData = await usersFile.getUsersFile();
    const userIndex = usersData.users.findIndex((user) => user.id === id);
    usersData.users.splice(userIndex, 1);
    await usersFile.setUsersFile(usersData);

    // Write permissions to permissions json file after deleting the desire user
    const permissionsData = await permissionsFile.getPermissionsFile();
    const permissionIndex = permissionsData.permissions.findIndex((permission) => permission.id === id);
    permissionsData.permissions.splice(permissionIndex, 1);
    await permissionsFile.setPermissionsFile(permissionsData);

    return 'Deleted';
}

module.exports = {
    getAllUsersAndPermissionsData,
    getUserAndPermissionDataByUserId,
    getAllUsersAndMessagesByUserId,
    addUserAndDefaultPermissionData,
    updateUserAndPermissionData,
    deleteUserAndPermissionData
}