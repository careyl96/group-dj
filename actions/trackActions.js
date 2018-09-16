import axios from 'axios';
import * as types from './types';

export const fetchTrackDataSuccess = trackData => ({
  type: types.FETCH_TRACK_DATA_SUCCESS,
  trackData,
});
export const fetchTrackProgressSuccess = startTimestamp => ({
  type: types.FETCH_TRACK_PROGRESS_SUCCESS,
  startTimestamp,
});
export const getPreviousTrackSuccess = () => ({ type: types.PREVIOUS_TRACK_SUCCESS });
export const seekTrackSuccess = newTrackPosition => ({
  type: types.SEEK_TRACK_SUCCESS,
  newTrackPosition,
});
export const skipTrackSuccess = () => ({ type: types.SKIP_TRACK_SUCCESS });

// ---------------------------- PLAYBACK ----------------------------

export const fetchTrackData = () => ({ type: types.FETCH_TRACK_DATA });

// export const fetchTrackProgress = () => (dispatch, getState) => {
//   const { accessToken } = getState().session;
//   const params = {
//     method: 'GET',
//     url: 'https://api.spotify.com/v1/me/player/currently-playing/',
//     headers: { Authorization: `Bearer ${accessToken}` },
//   };

//   return axios(params)
//     .then((response) => {
//       const trackProgress = response.data.progress_ms;
//       dispatch(fetchTrackProgressSuccess(trackProgress));
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };

// export const resumePlayback = () => (dispatch, getState) => {
//   console.log('resuming playback');
//   const { accessToken } = getState().session;
//   const params = {
//     method: 'PUT',
//     url: 'https://api.spotify.com/v1/me/player/play',
//     headers: { Authorization: `Bearer ${accessToken}` },
//   };
//   return axios(params)
//     .then(() => {
//       dispatch(resumePlaybackSuccess());
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };
export const resumePlayback = () => ({ type: types.RESUME_PLAYBACK });
export const resumePlaybackSuccess = () => ({ type: types.RESUME_PLAYBACK_SUCCESS });

export const pausePlayback = () => ({ type: types.PAUSE_PLAYBACK });
export const pausePlaybackSuccess = () => ({ type: types.PAUSE_PLAYBACK_SUCCESS });

export const seekTrack = newTrackPosition => (dispatch, getState) => {
  const { accessToken } = getState().session;
  const params = {
    method: 'PUT',
    url: 'https://api.spotify.com/v1/me/player/seek',
    params: { position_ms: newTrackPosition },
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  return axios(params)
    .then(() => {
      dispatch(seekTrackSuccess(newTrackPosition));
    })
    .catch((error) => {
      console.log(error);
    });
};
export const skipTrack = () => (dispatch, getState) => {
  const { accessToken } = getState().session;
  const params = {
    method: 'PUT',
    url: 'https://api.spotify.com/v1/me/player/seek',
    params: { position_ms: '50000' },
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  return axios(params)
    .then(() => {
      dispatch(fetchTrackData());
    })
    .catch((error) => {
      console.log(error);
    });
};

// ----------------------------- QUEUE -----------------------------

export const overridePlayingContext = (track, userID) => ({
  type: types.OVERRIDE_PLAYING_CONTEXT,
  track,
  userID,
});

// export const fetchTrackData = () => (dispatch, getState) => {
//   // console.log('fetching track data');
//   const { accessToken } = getState().session;
//   const params = {
//     method: 'GET',
//     url: 'https://api.spotify.com/v1/me/player/currently-playing/',
//     headers: { Authorization: `Bearer ${accessToken}` },
//   };

//   return axios(params)
//     .then((response) => {
//       console.log(response);
//       const currentlyPlaying = response.data.is_playing;
//       const trackName = response.data.item.name;
//       const artists = response.data.item.artists.map(artist => artist.name).join(', ');
//       const length = response.data.item.duration_ms;
//       const trackProgress = response.data.progress_ms;
//       const albumArt = response.data.item.album.images[2].url;
//       const { popularity } = response.data.item;

//       const trackData = {
//         currentlyPlaying,
//         trackName,
//         artists,
//         length,
//         trackProgress,
//         albumArt,
//         popularity,
//       };

//       dispatch(fetchTrackDataSuccess(trackData));
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };