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
const conversationsRouter = require('./routers/conversationsRouter');
const messagesRouter = require('./routers/messagesRouter');
const http = require('http').Server(app);

/*=======================================================================================================
/*================================//* Use Environment Variable *//*======================================
/*=====================================================================================================*/
const { API_PORT, MONGO_URL, SECRET, NODE_ENV, ORIGIN_DEV, ORIGIN_PRODUCTION } = process.env;
const port = process.env.PORT || API_PORT;

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
const corsOption = {
    origin: [NODE_ENV === 'production' ? ORIGIN_PRODUCTION : `${ORIGIN_DEV}:${5173}`],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}
app.use(cors(corsOption));

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
const whitelist = [NODE_ENV === 'production' ? ORIGIN_PRODUCTION : `${ORIGIN_DEV}:${5173}`];

const socketIO = require('socket.io')(http, {
    cors: {
        origin: whitelist,
        methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
        credentials: true,          // -----> access-control-allow-credentials:true
    }
});

app.use(function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader(
                "Access-Control-Allow-Methods",
                "GET,HEAD,OPTIONS,POST,PUT,DELETE"
        );
        res.setHeader(
                "Access-Control-Allow-Headers",
                "Origin,Cache-Control,Accept,X-Access-Token ,X-Requested-With, Content-Type, Access-Control-Request-Method"
        );
        if (req.method === "OPTIONS") {
                return res.status(200).end();
        }
        next();
});

// Open socket.io to establish a connection with a React app
let count = 0;
let users = [];
socketIO.on('connection', (socket) => {
    //========================================================================================================================================
    //===========================================//*⚡✅⚡ On - connection ⚡✅⚡*//*====================================================*/
    //========================================================================================================================================
    console.log("socket = ", socket.handshake);
    if (socket.handshake.headers.origin === (NODE_ENV === 'production' ? ORIGIN_PRODUCTION : `${ORIGIN_DEV}:${5173}`)) {
        console.log(
            `⚡: ${socket.id} user just connected!`
        );
        //------------------------------------------------------------------------------------------------------------------------
        //------1️⃣✔️ Triggers a "count" event when a user joins the server for the first time [Increase the amount users] -------
        //------------------------------------------------------------------------------------------------------------------------
        count++;
        socketIO.emit('count', count);
        console.log(count);

        //------------------------------------------------------------------------------------------------------------------------
        //------2️⃣✔️ Triggers a "newUser" event when a user joins the server for the first time [push to users array] -----------
        //------------------------------------------------------------------------------------------------------------------------        
        socket.on('newUser', (data) => {
            // Adds the new user to the list of users
            const isUserAvailable = users.find((user) => user.username === data.username);
            if (!isUserAvailable) {
                users.push(data);
            }

            // console.log('users (newUser) = ');
            // console.log(users);
            // Sends the list of users to the client
            socket.broadcast.emit('newUserResponse', users);
        });

        //------------------------------------------------------------------------------------------------------------------------
        //------3️⃣✔️ -------------- Listen and send a username of the user when he becomes online on the chat -------------------
        //------------------------------------------------------------------------------------------------------------------------         
        socket.on('onlineChat', (data) => {
            const index = users.findIndex((user) => user.username === data.username);
            if (index !== -1) {
                users[index].online_status = 'online';
            }

            // console.log('users (online) = ');
            // console.log(users);
            socketIO.emit('onlineChatResponse', users);
        });

        //------------------------------------------------------------------------------------------------------------------------
        //------4️⃣✔️ -------------- Listen and send a username of the user when he becomes online on the chat -------------------
        //------------------------------------------------------------------------------------------------------------------------         
        socket.on('offlineInSystem', (data) => {
            const index = users.findIndex((user) => user.username === data.username);
            if (index !== -1) {
                users[index].online_status = 'offline';
            }

            // console.log('users (offline) = ');
            // console.log(users);
            socketIO.emit('offlineInSystemResponse', users);
        });

        //------------------------------------------------------------------------------------------------------------------------
        //------5️⃣✔️ -------------- Listen and send a username of the user when he becomes online on the chat -------------------
        //------------------------------------------------------------------------------------------------------------------------         
        socket.on('availableInSystem', (data) => {
            const index = users.findIndex((user) => user.username === data.username);
            if (index !== -1) {
                users[index].online_status = 'available';
            }

            // console.log('users (available) = ');
            // console.log(users);
            socketIO.emit('availableInSystemResponse', users);
        });

        //------------------------------------------------------------------------------------------------------------------------
        //------6️⃣✔️------------ Listens and sends the message to all the users on the server -----------------------------------
        //------------------------------------------------------------------------------------------------------------------------         
        socket.on('message', (data) => {
            // console.log(data);
            socketIO.emit('messageResponse', data);
        });

        //------------------------------------------------------------------------------------------------------------------------
        //------7️⃣✔️------------ Listens and sends the message to all the users on the server -----------------------------------
        //------------------------------------------------------------------------------------------------------------------------
        socket.on('typing', (data) => {
            // console.log(data);
            socket.broadcast.emit('typingResponse', data);
        });

        //========================================================================================================================================
        //============================================//*🔥⛔🔥 On - disconnect 🔥⛔🔥*//*===================================================*/
        //========================================================================================================================================
        socket.on('disconnect', () => {
            //------------------------------------------------------------------------------------------------------------------------
            //-----1️⃣❌---------------------------- Decrease the amount users ["count" Event] ---------------------------------------
            //------------------------------------------------------------------------------------------------------------------------
            // Updates the amount of users online
            count--;
            //Sends the amount of users to the clients
            socketIO.emit('count', count);
            console.log(count);
            //------------------------------------------------------------------------------------------------------------------------
            //-----2️⃣❌------------------------ Updates the list of users ["newUserResponse" Event] ---------------------------------
            //------------------------------------------------------------------------------------------------------------------------
            //Updates the list of users when a user disconnects from the server
            users = users.filter((user) => user.socketID !== socket.id);
            //Sends the list of users to the clients
            socketIO.emit('newUserResponse', users);
            console.log('users = ');
            console.log(users);

            console.log('⛔: A user disconnected');
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
app.use('/conversations', conversationsRouter);
app.use('/messages', messagesRouter);

/*=======================================================================================================
/*====================================//* server listening *//*==========================================
/*=====================================================================================================*/
http.listen(port, () => {
    console.log(`-----------------------------------------------------------------`);
    NODE_ENV === 'production' ? console.log(`- Cinema server is running at ${ORIGIN_PRODUCTION}:${port} -`) : console.log(`- Cinema server is running at ${ORIGIN_DEV}:${port} -`);
    console.log(`-----------------------------------------------------------------`);
});
/* //3️⃣2️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣🔟🔚⛔❌✅❎✔️ 🎬🔜🔛🔄⏯️▶️♾️🆘🆗*/