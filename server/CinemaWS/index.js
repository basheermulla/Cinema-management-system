/*=======================================================================================================
/*========================================//* Requires *//*==============================================
/*=====================================================================================================*/
const express = require('express')
const app = express()
require("dotenv").config();
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const membersRouter = require('./routers/membersRouter');
const moviesRouter = require('./routers/moviesRouter');
const subscriptionsRouter = require('./routers/subscriptionsRouter');
const usersRouter = require('./routers/usersRouter');
const authRouter = require('./routers/authRouter');
const http = require('http').Server(app);

/*=======================================================================================================
/*================================//* Use Environment Variable *//*======================================
/*=====================================================================================================*/
const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;
const { MONGO_URL } = process.env;
const { SECRET } = process.env;

/*=======================================================================================================
/*====================================//* Connect Database *//*==========================================
/*=====================================================================================================*/
connectDB();
const store = new MongoDBStore({
    uri: MONGO_URL,
    collection: 'mySessions'
});

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
app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000  // By dafault, session timeout of 60 minutes (60 minute  * 60 seconds * 1000 milliseconds)
    },
    store: store
}));

/*=======================================================================================================
/*==========================//* Socket.io - Bi-Directional Communication *//*============================
/*=====================================================================================================*/
const whitelist = ['http://localhost:5173', 'http://localhost:3000'];

const socketIO = require('socket.io')(http, {
    cors: {
        origin: whitelist,
        methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
        credentials: true,          // -----> access-control-allow-credentials:true
    }
});

// Open socket.io to establish a connection with a React app 
let count = 0;
let users = [];
socketIO.on('connection', (socket) => {
    if (socket.handshake.headers.origin === 'http://localhost:5173' || socket.handshake.headers.origin === 'http://localhost:3000') {

        console.log(`⚡: ${socket.id} user just connected!`);

        // Triggers a "count" event when a user joins the server for the first time
        count++;
        socketIO.emit('count', count);
        console.log(count);

        // ===== Triggers a "newUser" event when a user joins the server for the first time
        socket.on('newUser', (data) => {
            // ===== Adds the new user to the list of users
            users.push(data);
            console.log(users);
            // ===== Sends the list of users to the client
            socketIO.emit('newUserResponse', users);
        });

        // Listens and logs the message to the console
        socket.on('message', (data) => {
            console.log(data);
        });

        // Listens when a user disconnect
        socket.on('disconnect', () => {
            count--;
            socket.broadcast.emit('count', count);
            console.log(count);
            console.log('🔥: A user disconnected');
        });
    }

});
 
/*=======================================================================================================
/*==================================//* Routers - Logic goes here *//*===================================
/*=====================================================================================================*/
app.use('/members', membersRouter);
app.use('/movies', moviesRouter);
app.use('/subscriptions', subscriptionsRouter);
app.use('/users', usersRouter);
app.use('/authentication', authRouter);

/*=======================================================================================================
/*====================================//* server listening *//*==========================================
/*=====================================================================================================*/
http.listen(port, () => {
    console.log(`------------------------------------------------------------`)
    console.log(`- Subscription server is running at http://localhost: ${port} -`)
    console.log(`------------------------------------------------------------`)
});