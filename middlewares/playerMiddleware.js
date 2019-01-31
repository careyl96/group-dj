import axios from 'axios';
import * as types from '../actions/types';
import {
  fetchPlayingContextSuccess,
  resumePlaybackSuccess,
  pausePlaybackSuccess,
} from '../actions/playerActions';

const fetchPlayingContext = () => async (dispatch) => {
  try {
    const playingContext = await axios.get('/api/playing-context');
    dispatch(fetchPlayingContextSuccess(playingContext.data));
  } catch (error) {
    console.log(error);
  }
};

const resumePlayback = () => async (dispatch, getState) => {
  const { id } = getState().playingContext;
  try {
    const trackProgress = (await axios.get('/api/server-track-progress')).data;
    const params = {
      method: 'PUT',
      url: 'https://api.spotify.com/v1/me/player/play',
      data: {
        uris: [`spotify:track:${id}`],
        position_ms: trackProgress,
      },
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
    };
    await axios(params);
    dispatch(resumePlaybackSuccess());
  } catch (error) {
    console.log(error);
  }
};

const pausePlayback = () => async (dispatch) => {
  try {
    const params = {
      method: 'PUT',
      url: 'https://api.spotify.com/v1/me/player/pause',
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
    };
    await axios(params);
    dispatch(pausePlaybackSuccess());
  } catch (error) {
    console.log(error.response.data.error.message);
  }
};

const handlePlayState = () => (dispatch, getState) => {
  dispatch({ type: types.MODIFY_PLAYBACK_STATE });
  const { currentlyPlaying, name } = getState().playingContext;
  if (currentlyPlaying) {
    dispatch(resumePlayback());
  } else if (name) {
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
