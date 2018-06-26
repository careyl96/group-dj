const express = require('express');
const morgan = require('morgan');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const handleSocketEvents = require('./socket-manager');

io.on('connection', handleSocketEvents);

app.use(morgan('dev'));
app.use(express.static('./client/dist'));

const port = 3006;
server.listen(process.env.PORT || port, (err) => {
  if (err) throw err;
  console.log(`Listening on http://localhost:${process.env.PORT || port}`);
});

module.exports = io;
