const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const config = require('../auth/config');

const socketApi = require('./api');
const authRouter = require('./auth');
const savedRouter = require('./saved');

const apiRouter = socketApi(io);

app.use(cookieParser());
app.use(cors());
app.use('/auth', authRouter); // authentication routes
app.use('/api', apiRouter); // other routes
app.use('/saved', savedRouter); // other routes

app.use(express.static(path.join(__dirname, '../client/dist')));

const port = 3006;
server.listen(process.env.PORT || port, (error) => {
  if (error) throw error;
  console.log(`Listening on ${config.HOST}`);
});

module.exports = io;
