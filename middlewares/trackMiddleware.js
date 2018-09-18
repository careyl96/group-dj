import axios from 'axios';
import * as types from '../actions/types';
import { fetchTrackDataSuccess, playTrackSuccess, pausePlaybackSuccess } from '../actions/trackActions';

const formatTrackData = (response) => {
  let formattedTrackData = null;
  if (Object.prototype.hasOwnProperty.call(response.data, 'track')) {
    formattedTrackData = {
      currentlyPlaying: response.data.currentlyPlaying,
      startTimestamp: response.data.startTimestamp,
      lastPausedAt: response.data.lastPausedAt,
      totalTimePaused: response.data.totalTimePaused,
      seekDistance: response.data.seekDistance,
      userID: response.data.userID,
      name: response.data.track.name,
      artists: response.data.track.artists.map(artist => artist.name).join(', '),
      length: response.data.track.duration_ms,
      albumArt: response.data.track.album.images[2].url,
      popularity: response.data.track.popularity,
      id: response.data.track.id,
    };
  }
  return formattedTrackData;
};

const fetchTrackData = () => (dispatch) => {
  axios.get('/api/playing-context')
    .then((trackData) => {
      console.log(trackData.data);
      dispatch(fetchTrackDataSuccess(formatTrackData(trackData)));
    })
    .catch((error) => {
      console.log(error);
    });
};
const playTrack = () => (dispatch, getState) => {
  const {
    id,
    startTimestamp,
    totalTimePaused,
    seekDistance,
  } = getState().trackData;

  if (id) {
    return axios({
      method: 'PUT',
      url: 'https://api.spotify.com/v1/me/player/play',
      data: {
        uris: [`spotify:track:${id}`],
        position_ms: Date.now() - startTimestamp - totalTimePaused + seekDistance,
      },
      headers: { Authorization: `Bearer ${getState().session.accessToken}` },
    })
      .then(() => {
        dispatch(playTrackSuccess());
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
  const { currentlyPlaying } = getState().trackData;
  if (currentlyPlaying === false) {
    dispatch(pauseTrack());
  } else if (currentlyPlaying === true) {
    dispatch(playTrack());
  }
};

export default store => next => (action) => {
  const result = next(action);
  switch (action.type) {
    case types.FETCH_TRACK_DATA:
      store.dispatch(fetchTrackData());
      break;
    case types.FETCH_TRACK_DATA_SUCCESS:
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