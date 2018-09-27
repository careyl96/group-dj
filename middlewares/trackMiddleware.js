import axios from 'axios';
import * as types from '../actions/types';
import {
  fetchPlayingContextSuccess,
  resumePlaybackSuccess,
  pausePlaybackSuccess,
} from '../actions/trackActions';


const fetchPlayingContext = () => (dispatch) => {
  return axios.get('/api/playing-context')
    .then((playingContext) => {
      dispatch(fetchPlayingContextSuccess(playingContext.data));
    })
    .catch((error) => {
      console.log(error);
    });
};
const resumePlayback = () => (dispatch, getState) => {
  const { id } = getState().playingContext;
  return axios.get('/api/server-track-progress')
    .then((response) => {
      const trackProgress = response.data;
      return axios({
        method: 'PUT',
        url: 'https://api.spotify.com/v1/me/player/play',
        data: {
          uris: [`spotify:track:${id}`],
          position_ms: trackProgress,
        },
        headers: { Authorization: `Bearer ${getState().session.accessToken}` },
      })
        .then(() => {
          console.log('Resumed playback');
          dispatch(resumePlaybackSuccess());
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
};
const pausePlayback = () => (dispatch, getState) => {
  return axios({
    method: 'PUT',
    url: 'https://api.spotify.com/v1/me/player/pause',
    headers: { Authorization: `Bearer ${getState().session.accessToken}` },
  })
    .then(() => {
      console.log('Paused playback');
      dispatch(pausePlaybackSuccess());
    })
    .catch((error) => {
      // console.log(error.config);
      // console.log(error.request);
      console.log(error.response.data.error.message);
    });
};
const handlePlayState = () => (dispatch, getState) => {
  const { currentlyPlaying } = getState().playingContext;
  if (currentlyPlaying) {
    dispatch(resumePlayback());
  } else {
    dispatch(pausePlayback());
  }
};


export default store => next => (action) => {
  const result = next(action);
  switch (action.type) {
    case types.FETCH_PLAYING_CONTEXT:
      store.dispatch(fetchPlayingContext());
      break;
    case types.FETCH_PLAYING_CONTEXT_SUCCESS:
      store.dispatch(handlePlayState());
      break;
    default:
      break;
  }
  return result;
};

// SOCKET LISTENERS

// ESTABLISH CONNECTION WITH SERVER ON SUCCESSFUL CONNECTION + AUTHENTICATION

// when a user connects to server, update users in server
// then notify everyone connected to server by updating connected users
// CLIENT CONNECT -> UPDATE SERVER USER LIST -> NOTIFY ALL CLIENTS

// when a user connects to server, grab queue data from server
// update state
// CLIENT CONNECT -> GRAB INFO FROM SERVER -> UPDATE CLIENT

// when a user queues a track, update queue
// CLIENT QUEUE -> UPDATE SERVER QUEUE INFO -> NOTIFY ALL CLIENTS

// when a user removes/moves a track, update queue
// CLIENT QUEUE -> UPDATE SERVER QUEUE INFO -> NOTIFY ALL CLIENTS

// when a track is removed from the queue, add to playing history
// CLIENT QUEUE -> UPDATE SERVER QUEUE INFO -> NOTIFY ALL CLIENTS