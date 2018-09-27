const express = require('express');
const path = require('path');
const cors = require('cors');
// const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const authRouter = require('./auth');
const socketApi = require('./api');

app.use(cookieParser());
app.use(cors());
app.use('/auth', authRouter); // authentication routes
app.use('/api', socketApi(io)); // other routes

// app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../client/dist')));

const port = 3006;
server.listen(process.env.PORT || port, (error) => {
  if (error) throw error;
  console.log(`Listening on http://localhost:${process.env.PORT || port}`);
});

module.exports = io;
