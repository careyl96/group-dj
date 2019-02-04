import io from 'socket.io-client';
import * as types from '../actions/types';
import config from '../auth/config';
import ServerDate from '../helpers/serverDate';
import { updateUsers } from '../actions/usersActions';
import { fetchPlayingContext, fetchPlayingContextSuccess } from '../actions/playerActions';
import {
  fetchQueue,
  fetchQueueSuccess,
  fetchRecentlyPlayed,
  fetchPlayHistorySuccess,
  fetchMostPlayed,
} from '../actions/viewActions';
import { fetchAvailableDevices } from '../actions/devicesActions';

let socket = null;
// let serverSynchronizer = null;
let serverDate = null;

const initSocket = (store) => {
  socket = io(config.HOST);
  serverDate = new ServerDate(socket);
  socket.on('connect', () => {
    // serverSynchronizer = setInterval(() => { socket.emit('time'); }, 300);
    const { user } = store.getState().session;
    socket.emit('add user', user);
    store.dispatch(fetchAvailableDevices());
    store.dispatch(fetchPlayingContext());
    store.dispatch(fetchQueue());
    store.dispatch(fetchRecentlyPlayed());
  });
  socket.on('update users', (data) => {
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
  socket.on('fetch most played', () => {
    store.dispatch(fetchMostPlayed());
  });
  socket.on('fetch queue', (queue) => {
    store.dispatch(fetchQueueSuccess(queue));
  });
  socket.on('user action', (socketId) => {
    if (document.querySelector(`.${socketId}`) !== null) {
      const avatar = document.querySelector(`.${socketId}`);
      if (avatar.classList.contains('flash')) avatar.classList.remove('flash');
      avatar.classList.add('flash');
      setTimeout(() => { avatar.classList.remove('flash'); }, 500);
    }
  });
  socket.on('error', (error) => {
    console.log(error);
  });
  socket.on('disconnect', () => {
    // clearInterval(serverSynchronizer);
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
    case types.QUEUE_PLAYLIST:
      socket.emit('queue playlist', action.playlist, action.user);
      break;
    case types.REMOVE_TRACK:
      socket.emit('remove track', action.track);
      break;
    case types.UPDATE_QUEUE:
      socket.emit('update queue', action.oldIndex, action.newIndex);
      break;
    default:
      break;
  }
  return result;
};

export { serverDate };
