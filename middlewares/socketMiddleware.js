import io from 'socket.io-client';
import * as types from '../actions/types';
import config from '../auth/config';
import { updateUsers } from '../actions/usersActions';

let socket = null;

export const initSocket = (store) => {
  console.log('initializing socket');
  socket = io(config.HOST);
  socket.on('connect', () => {
    const newUser = {};
    const { user, userImg } = store.getState().session;

    newUser.id = socket.id;
    newUser.username = user;
    newUser.thumbnail = userImg;
    console.log(`socket id: ${socket.id}`);
    socket.emit('add user', newUser);
  });
  socket.on('update users', (data) => {
    console.log('updating users');
    store.dispatch(updateUsers(data));
  });
};

export default store => next => (action) => {
  const result = next(action);
  switch (action.type) {
    case types.LOGIN_SUCCESS:
      initSocket(store);
      break;
    case types.QUEUE_TRACK:
      // const { track } = action
      // socket.emit(types.QUEUE_TRACK, track);
      break;
    default:
      break;
  }
  return result;
};
