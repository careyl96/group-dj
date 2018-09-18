import io from 'socket.io-client';
import * as types from '../actions/types';
import config from '../auth/config';
import { updateUsers } from '../actions/usersActions';
import { fetchTrackData } from '../actions/trackActions';
import { fetchQueue, fetchRecentlyPlayed } from '../actions/viewActions';

let socket = null;

const initSocket = (store) => {
  socket = io(config.HOST);
  socket.on('connect', () => {
    const newUser = {};
    const { user, userImg } = store.getState().session;

    newUser.id = socket.id;
    newUser.username = user;
    newUser.thumbnail = userImg;
    socket.emit('add user', newUser);
    store.dispatch(fetchTrackData());
    store.dispatch(fetchQueue());
    store.dispatch(fetchRecentlyPlayed());
    // store.dispatch(fetchMostPlayed());
    // store.dispatch(fetchMySongs());
  });
  socket.on('update users', (data) => {
    console.log('~~~~~Updating User List~~~~~');
    store.dispatch(updateUsers(data));
  });
  socket.on('fetch now playing', () => {
    store.dispatch(fetchTrackData());
  });
  socket.on('fetch recently played', () => {
    store.dispatch(fetchRecentlyPlayed());
  });
};

export default store => next => (action) => {
  const result = next(action);
  switch (action.type) {
    case types.LOGIN_SUCCESS:
      initSocket(store);
      break;
    case types.QUEUE_TRACK:
      break;
    case types.PAUSE_PLAYBACK:
      socket.emit('pause playback');
      break;
    case types.PLAY_TRACK:
      socket.emit('play track');
      break;
    case types.BACK_TRACK:
      socket.emit('back track');
      break;
    case types.SEEK_TRACK:
      socket.emit('seek track', action.newTrackPosition);
      break;
    case types.OVERRIDE_PLAYING_CONTEXT:
      socket.emit('override playing context', action.track);
      break;
    default:
      break;
  }
  return result;
};
