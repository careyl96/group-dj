import axios from 'axios';
import * as types from '../actions/types';
import serverDate from '../helpers/serverDate';
import { fetchPlayingContextSuccess, resumePlaybackSuccess, pausePlaybackSuccess, adjustVolumeSuccess } from '../actions/trackActions';

const fetchPlayingContext = () => (dispatch) => {
  axios.get('/api/playing-context')
    .then((playingContext) => {
      dispatch(fetchPlayingContextSuccess(playingContext.data));
    })
    .catch((error) => {
      console.log(error);
    });
};
const resumePlayback = () => (dispatch, getState) => {
  const { id, startTimestamp, totalTimePaused, seekDistance } = getState().playingContext;
  if (id) {
    return axios({
      method: 'PUT',
      url: 'https://api.spotify.com/v1/me/player/play',
      data: {
        uris: [`spotify:track:${id}`],
        position_ms: serverDate.now() - startTimestamp - totalTimePaused + seekDistance,
      },
      headers: { Authorization: `Bearer ${getState().session.accessToken}` },
    })
      .then(() => {
        dispatch(resumePlaybackSuccess());
      })
      .catch((err) => {
        console.log(err);
      });
  }
  console.log('Nothing playing');
};
const pauseTrack = () => (dispatch, getState) => {
  console.log('---------- PAUSING TRACK ----------');
  return axios({
    method: 'PUT',
    url: 'https://api.spotify.com/v1/me/player/pause',
    headers: { Authorization: `Bearer ${getState().session.accessToken}` },
  })
    .then(() => {
      dispatch(pausePlaybackSuccess());
    })
    .catch((err) => {
      console.log(err);
    });
};
const handlePlayState = () => (dispatch, getState) => {
  const { currentlyPlaying } = getState().playingContext;
  if (currentlyPlaying === false) {
    dispatch(pauseTrack());
  } else if (currentlyPlaying === true) {
    dispatch(resumePlayback());
  }
};
const adjustVolume = volume => (dispatch, getState) => {
  return axios({
    method: 'PUT',
    url: 'https://api.spotify.com/v1/me/player/volume',
    params: { volume_percent: volume },
    headers: { Authorization: `Bearer ${getState().session.accessToken}` },
  })
    .then(() => {
      dispatch(adjustVolumeSuccess());
    })
    .catch((err) => {
      console.log(err);
    });
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
    case types.ADJUST_VOLUME:
      store.dispatch(adjustVolume(action.volume));
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