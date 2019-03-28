require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const socket = require('socket.io');
const mongoose = require('mongoose');

//mongoose models
const User = require('./models/user.model');
const Conversation = require('./models/conversation.model');
const Message = require('./models/message.model');

//Express Setup
const app = express();
app.use(bodyParser.json());
app.use(cors());

//env file variables
let {
    DATABASE_CONNECTION
} = process.env;


//test post
app.post('/create', (req, res,) => {
    const user = new User({
        _id: mongoose.Types.ObjectId(),
        username: 'TayteTest',
        password: 'TestPass',
        title: 'Nice Guy',
        is_active: false
    });
    
    user.save().then(result => {
        console.log(result);
        res.status(200).send('user created');
    }).catch(err => {
        if(err) throw err;
        res.status(500).send(err);
    });
})

//mongoose db connection
mongoose.connect(DATABASE_CONNECTION, {useNewUrlParser: true}, () => {
    console.log('Connected to Mongodb cluster')
});

const server = app.listen(4000, () => {
    console.log(`Server is running on port 4000`);
});

//SOCKET SETUP
const io = socket(server);



//this function fires when the client connects to the server socket
io.on('connection', (socket) => {
    console.log('socket connected on:', socket.handshake.time)
    socket.emit('welcome', {userID: socket.id});

    //listens for a new message then emits it to the other sockets
    socket.on('new message', (data) => {
        data.user = this.id;
        io.emit('message dispatched', data)
    })
})