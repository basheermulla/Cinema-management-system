const usersFile = require('../DAL/usersFile');
const permissionsFile = require('../DAL/permissionsFile');
const User = require('../models/userModel');

/*=======================================================================================================
/*=================//* Work against jsonfiles [permissions.json, users.json] *//*========================
/*========================//* Work against mongoDB Users Collection *//*=================================
/*=========================//*  CRUD - Create, Read, Update, Delete *//*=================================
/*=====================================================================================================*/

//======================================================================
//                    GET - User register utility                      =
//     Checking if the User was created by the system administrator    =
//                 And return message/data accordance                  =
//======================================================================
const getUsernameToRegister = async (usernameCheck) => {
    // Get username from mongoDB Users Collection
    const result_user = await User.findOne({ username: usernameCheck });
    if (!result_user?.username) {
        return { message: `The user '${usernameCheck}' was not created by the system administrator.` };
    }

    return { _id: result_user._id.toHexString(), userRegister: result_user.username };
}

//================================================================================
//                       PUT - User registration utility                         =
//               Once the administrator have been create username                =
// This utility function for adding the password to the mongoDB Users Collection =
//================================================================================
const addUserPassword = async (id, obj, options) => {
    // Extract received data regarding the new user 
    const { password } = obj;

    // Update username without password into mongoDB Users Collection
    await User.findByIdAndUpdate(id, { password: password }, options);

    return { message: 'User registered successfully' };
}

//======================================================================
//                     GET - User login utility                        =
//        Checking if the User [found, not found or just created]      =
//                 And return message/data accordance                  =
//======================================================================
const getUserByUsername = async (usernameCheck) => {
    // Get username from mongoDB Users Collection
    const result_user = await User.findOne({ username: usernameCheck });
    if (!result_user?.username) {
        return { message: `The user '${usernameCheck}' is not found ! please contact the system administrator.` };
    }

    if (!result_user?.password) {
        return { message: `Missing password ! The user' ${usernameCheck}' needs to register before login.` };
    }

    // Read users and permissions json file
    const users = await usersFile.getUsersFile();
    const permissions = await permissionsFile.getPermissionsFile();

    // User _id from mongoDB
    const _id = result_user._id.toHexString()

    // Find the desire user and its permissions
    let userDetails = users.users.find((user) => user.id === _id);
    const getUserPermission = permissions.permissions.find((permission) => permission.id === _id);
    
    let subscriptionsPermissionArray = [];
    let moviesPermissionArray = [];
    getUserPermission.permissionsUser.forEach((permission, index) => {
        if (index <= 3) {
            if (Object.values(permission)[0]) {
                const permission_Letter = Object.keys(permission)[0][0];
                subscriptionsPermissionArray.push(permission_Letter.toUpperCase())
            }
        } else {
            if (Object.values(permission)[0]) {
                const permission_Letter = Object.keys(permission)[0][0];
                moviesPermissionArray.push(permission_Letter.toUpperCase())
            }
        }
    })

    // Map the desire user with its username and permissions    
    const obj_user = {
        ...userDetails,
        username: result_user.username,
        password: result_user.password,
        SubscriptionsRoles: subscriptionsPermissionArray,
        MoviesRoles: moviesPermissionArray,
        ...getUserPermission
    }

    return { userLogin: obj_user };
}

module.exports = {
    getUsernameToRegister,
    getUserByUsername,
    addUserPassword
}