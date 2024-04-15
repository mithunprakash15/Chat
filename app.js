const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const routes = require('./routes');

const { User } = require('./db');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const port = process.env.PORT || 3001;

app.use(express.json());
app.use('/', routes);

const socketToUser = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('login', async (username) => {
    socketToUser[socket.id] = username;
    console.log(`${username} logged in`);

    const user = await User.findOne({ username });
    if (user) {
      const oldMessages = user.messages;
      socket.emit('old messages', oldMessages);
    }
  });

  socket.on('private message', async ({ to, message }) => {
    const senderUsername = socketToUser[socket.id];
    console.log(`Private message from ${senderUsername} to ${to}: ${message}`);

    const targetSocketId = Object.keys(socketToUser).find(
      (socketId) => socketToUser[socketId] === to
    );

    if (targetSocketId) {
      io.to(targetSocketId).emit('private message', {
        from: senderUsername,
        message,
      });

      await User.updateOne(
        { username: to },
        { $push: { messages: { from: senderUsername, to, message } } }
      );
    } else {
      console.log(`User ${to} not found`);
    }
  });

  // socket.on('disconnect', () => {
  //   const username = socketToUser[socket.id];
  //   if (username) {
  //     console.log(`${username} disconnected`);
  //   }
  //   delete socketToUser[socket.id];
  // });
});

mongoose.connect('mongodb://127.0.0.1:27017/chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

server.listen(port, () => {
  console.log(`Running on port ${port}`);
});
