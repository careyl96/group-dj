const io = require('./index');
const { ADD_USER, USER_CONNECTED, LOGOUT } = require('../client/src/events');

let connectedUsers = {};

const handleSocketEvents = (socket) => {
  console.log(`Socket ID: ${socket.id}`);
};

module.exports = handleSocketEvents;
