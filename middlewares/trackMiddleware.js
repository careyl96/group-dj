import axios from 'axios';
import * as types from '../actions/types';
import { fetchTrackDataSuccess, resumePlaybackSuccess, pausePlaybackSuccess } from '../actions/trackActions';
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

const playTrack = trackData => (dispatch, getState) => {
  console.log('---------- PLAYING TRACK ----------');
  return axios({
    method: 'PUT',
    url: 'https://api.spotify.com/v1/me/player/play',
    data: {
      uris: [`spotify:track:${trackData.id}`],
      position_ms: Date.now() - trackData.startTimestamp - trackData.totalTimePaused + trackData.seekDistance,
    },
    headers: { Authorization: `Bearer ${getState().session.accessToken}` },
  });
};

const pauseTrack = () => (dispatch, getState) => {
  console.log('---------- PAUSING TRACK ----------');
  return axios({
    method: 'PUT',
    url: 'https://api.spotify.com/v1/me/player/pause',
    headers: { Authorization: `Bearer ${getState().session.accessToken}` },
  });
};

export default store => next => (action) => {
  const result = next(action);
  switch (action.type) {
    case types.FETCH_TRACK_DATA:
      axios.get('/api/now-playing')
        .then((response) => {
          if (response.data) {
            const trackData = {
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

            store.dispatch(fetchTrackDataSuccess(trackData));
          }
        })
        .catch((error) => {
          console.log('no songs playing');
        });
      break;
    case types.FETCH_TRACK_DATA_SUCCESS:
      if (store.getState().trackData.currentlyPlaying === false) {
        store.dispatch(pauseTrack())
          .then(() => {
            console.log('successfully made request to pause track');
          })
          .catch((error) => {
            console.log('error pausing playback');
            console.log(error);
          });
        } else if (store.getState().trackData.currentlyPlaying === true) {
          store.dispatch(playTrack(store.getState().trackData))
          .then(() => {
            console.log(`Playing track: ${store.getState().trackData.name}: ${store.getState().trackData.id}`);
          })
          .catch((error) => {
            console.log(error);
          });
      }
      break;
    default:
      break;
  }
  return result;
};
