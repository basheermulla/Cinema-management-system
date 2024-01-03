/*=======================================================================================================
/*========================================//* Requires *//*==============================================
/*=====================================================================================================*/
const express = require('express')
const app = express()
require("dotenv").config();
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const membersRouter = require('./routers/membersRouter');
const moviesRouter = require('./routers/moviesRouter');
const subscriptionsRouter = require('./routers/subscriptionsRouter');
const usersRouter = require('./routers/usersRouter');

/*=======================================================================================================
/*================================//* Use Environment Variable *//*======================================
/*=====================================================================================================*/
const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;
const { MONGO_URL } = process.env;

/*=======================================================================================================
/*====================================//* Connect Database *//*==========================================
/*=====================================================================================================*/
connectDB();

/*=======================================================================================================
/*=======================================//* Middlewares *//*============================================
/*=====================================================================================================*/

// Cross-Origin Resource Sharing (CORS) is a mechanism 
// that gives permission for one origin (domain) to access another origin
app.use(cors({ withCredentials: false }));

// built in middleware function in Express starting from v4.16.0. 
// It parses incoming JSON requests and puts the parsed data in req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*=======================================================================================================
/*===============================//* Create a session middleware *//*====================================
/*=====================================================================================================*/


/*=======================================================================================================
/*==================================//* Routers - Logic goes here *//*===================================
/*=====================================================================================================*/
app.use('/members', membersRouter);
app.use('/movies', moviesRouter);
app.use('/subscriptions', subscriptionsRouter);
app.use('/users', usersRouter);

/*=======================================================================================================
/*====================================//* server listening *//*==========================================
/*=====================================================================================================*/
app.listen(port, () => {
    console.log(`------------------------------------------------------------`)
    console.log(`- Subscription server is running at http://localhost: ${port} -`)
    console.log(`------------------------------------------------------------`)
});