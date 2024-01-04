const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authBLL = require('../BLL/authBLL');

const router = express.Router();

/*=======================================================================================================
/*===================================//* Work with - authBLL.js *//*=====================================
/*============================//* Functions - register, login, logout *//*===============================
/*==========================//* Entry Point:> http://localhost:8082/auth *//*============================
/*=====================================================================================================*/

// POST - register
router.post('/register', async (req, res) => {
    try {
        // Extract body data regarding the user register
        const { username, password } = req.body;

        // Get username from mongoDB Users Collection    
        const { _id, message, userRegister } = await authBLL.getUsernameToRegister(username);

        // true If - The user was not created by the system administrator
        if (!userRegister) {
            return res.status(401).send({ message: message });
        }

        // User was created by the system administrator - Let's hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // User was created by the system administrator - Let's hash the password
        const obj = ({ password: hashedPassword });
        const result = await authBLL.addUserPassword(_id, obj, { new: true });

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// POST - login
router.post('/login', async (req, res) => {
    try {
        // Extract body data regarding the user login
        const { username, password } = req.body;

        // Get user by username from mongoDB Users Collection    
        const { message, userLogin } = await authBLL.getUserByUsername(username);

        // true If - 1. The user is not found at all ! Not created by the system administrator
        //              Or
        //           2. Missing password ! needs to register before login
        if (!userLogin) {
            return res.status(401).send({ message: message });
        }

        // Compare the given password with the stored password using the bcrypt module
        const passwordMatch = await bcrypt.compare(password, userLogin.password);
        console.log(passwordMatch);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });
        }

        // User is authenticated - Let's generate a token
        const { ACCESS_SECRET_TOKEN } = process.env;
        const accessToken = jwt
            .sign({ userId: userLogin?._id }, ACCESS_SECRET_TOKEN, { expiresIn: userLogin.user['sessionTimeOut'] });

        console.log(accessToken);
        // Prevent sending the password to the client
        delete userLogin.password;

        //=============================================================================================
        //                                Using Session Express                                       =
        //=============================================================================================
        // Store user data and accessToken in session that provided by express-session middleware

        if (!req.session.flag) { // Just once
            req.session.flag = true;
            // Set an array to save users' data and accessToken
            req.session.map_Users = [];
        }

        const get_Session_Users = req.session.map_Users;
        const isLoggedIn = get_Session_Users.find((user) => user.userLogin._id === userLogin['_id']);
        if (!isLoggedIn) {
            const use_Session_Store = {
                isLoggedIn: true,
                accessToken,
                sessionTimeOut: userLogin.user['sessionTimeOut'],
                userLogin
            }

            req.session.map_Users.push(use_Session_Store);
        }

        // Update maxAge according to the user's session timeout
        const set_maxAge_session = userLogin.user['sessionTimeOut'] * 60 * 1000;
        req.session.cookie.maxAge = set_maxAge_session;

        res.status(200).json({ message: 'User logged in successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// POST - logout
router.post('/logout', async (req, res) => {
    // When a user logs out or the session expires, we will destroy the session
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        } else {
            res.status(200).json({ message: 'You logged out ! Good bye.' });
        }
    });
});

module.exports = router;