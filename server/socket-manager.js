const { VERIFY_USER, USER_CONNECTED, LOGOUT } = require('../client/src/events');

const connectedUsers = {};

const handleSocketEvents = (socket) => {
  console.log(`Socket ID: ${socket.id}`);
  socket.on(VERIFY_USER, () => {
    console.log('verifying user');
  });
  socket.on(USER_CONNECTED, () => {
    console.log('user connected');
  });
  socket.on(LOGOUT, () => {
    console.log('user logged out');
  });
};

module.exports = handleSocketEvents;
