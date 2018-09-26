import io from 'socket.io-client';
import * as types from '../actions/types';
import config from '../auth/config';
import ServerDate from '../helpers/serverDate';
import { updateUsers, updateUserID } from '../actions/usersActions';
import { fetchPlayingContext, fetchPlayingContextSuccess } from '../actions/trackActions';
import {
  fetchQueue,
  fetchQueueSuccess,
  fetchRecentlyPlayed,
  fetchPlayHistorySuccess,
} from '../actions/viewActions';
import { fetchAvailableDevices } from '../actions/devicesActions';

let socket = null;
let interval = null;
let serverDate = null;

const initSocket = (store) => {
  socket = io(config.HOST);
  serverDate = new ServerDate(socket);
  socket.on('connect', () => {
    interval = setInterval(() => { socket.emit('time'); }, 100);
    const newUser = {};
    const { user, avatar } = store.getState().session;
    newUser.id = socket.id;
    newUser.username = user;
    newUser.thumbnail = avatar;

    socket.emit('add user', newUser);
    store.dispatch(updateUserID(socket.id));
    store.dispatch(fetchAvailableDevices());
    store.dispatch(fetchPlayingContext());
    store.dispatch(fetchQueue());
    store.dispatch(fetchRecentlyPlayed());
  });
  socket.on('update users', (data) => {
    console.log('~~~~~Updating User List~~~~~');
    store.dispatch(updateUsers(data));
  });
  socket.on('fetch playing context', (playingContext) => {
    store.dispatch(fetchPlayingContextSuccess(playingContext));
  });
  socket.on('fetch recently played', () => {
    store.dispatch(fetchRecentlyPlayed());
  });
  socket.on('fetch play history', (playHistory) => {
    store.dispatch(fetchPlayHistorySuccess(playHistory));
  });
  socket.on('fetch queue', (queue) => {
    store.dispatch(fetchQueueSuccess(queue));
  });
  socket.on('disconnect', () => {
    clearInterval(interval);
  });
};

export default store => next => (action) => {
  const result = next(action);
  switch (action.type) {
    case types.LOGIN_SUCCESS:
      initSocket(store);
      break;
    case types.OVERRIDE_PLAYING_CONTEXT:
      socket.emit('override playing context', action.track, action.user);
      break;
    case types.RESUME_PLAYBACK:
      socket.emit('resume playback');
      break;
    case types.PAUSE_PLAYBACK:
      socket.emit('pause playback');
      break;
    case types.SEEK_TRACK:
      socket.emit('seek track', action.newTrackPosition);
      break;
    case types.BACK_TRACK:
      socket.emit('back track');
      break;
    case types.SKIP_TRACK:
      socket.emit('skip track');
      break;
    case types.QUEUE_TRACK:
      socket.emit('queue track', action.track, action.user);
      break;
    case types.REMOVE_TRACK:
      socket.emit('remove track', action.track);
      break;
    default:
      break;
  }
  return result;
};

export { serverDate };
