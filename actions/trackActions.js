import axios from 'axios';
import store from '../store/store';
import * as types from './types';


export const fetchTrackSuccess = trackData => ({
  type: types.FETCH_TRACK_DATA_SUCCESS,
  trackData,
});
export const getPreviousTrackSuccess = () => ({ type: types.PREVIOUS_TRACK_SUCCESS });
export const playTrackSuccess = () => ({ type: types.RESUME_PLAYBACK_SUCCESS });
export const pauseTrackSuccess = () => ({ type: types.PAUSE_PLAYBACK_SUCCESS });
export const seekTrackSuccess = newTrackPosition => ({
  type: types.SEEK_TRACK_SUCCESS,
  newTrackPosition,
});
export const skipTrackSuccess = () => ({ type: types.SKIP_TRACK_SUCCESS });

export const fetchTrackData = () => (dispatch) => {
  // console.log('fetching track data');
  const { accessToken } = store.getState().session;
  const params = {
    method: 'GET',
    url: 'https://api.spotify.com/v1/me/player/currently-playing/',
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  axios(params)
    .then((response) => {
      const currentlyPlaying = response.data.is_playing;
      const trackName = response.data.item.name;
      const artists = response.data.item.artists.map(artist => artist.name).join(', ');
      const trackLength = response.data.item.duration_ms;
      const trackProgress = response.data.progress_ms;
      const albumArt = response.data.item.album.images[2].url;
      const { popularity } = response.data.item;

      const trackData = {
        currentlyPlaying,
        trackName,
        artists,
        trackLength,
        trackProgress,
        albumArt,
        popularity,
      };

      dispatch(fetchTrackSuccess(trackData));
    })
    .catch((error) => {
      console.log(error);
    });
};
export const resumePlayback = () => (dispatch) => {
  const { accessToken } = store.getState().session;
  const params = {
    method: 'PUT',
    url: 'https://api.spotify.com/v1/me/player/play',
    headers: { Authorization: `Bearer ${accessToken}` },
  };
  axios(params)
    .then(() => {
      dispatch(playTrackSuccess());
    })
    .catch((error) => {
      console.log(error);
    });
};
export const pausePlayback = () => (dispatch) => {
  const { accessToken } = store.getState().session;
  const params = {
    method: 'PUT',
    url: 'https://api.spotify.com/v1/me/player/pause',
    headers: { Authorization: `Bearer ${accessToken}` },
  };
  axios(params)
    .then(() => {
      dispatch(pauseTrackSuccess());
    })
    .catch((error) => {
      console.log(error);
    });
};
export const seekTrack = newTrackPosition => (dispatch) => {
  const { accessToken } = store.getState().session;
  const params = {
    method: 'PUT',
    url: 'https://api.spotify.com/v1/me/player/seek',
    params: { position_ms: newTrackPosition },
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  axios(params)
    .then(() => {
      dispatch(seekTrackSuccess(newTrackPosition));
    })
    .catch((error) => {
      console.log(error);
    });
};
export const skipTrack = () => (dispatch) => {
  const { accessToken } = store.getState().session;
  const params = {
    method: 'PUT',
    url: 'https://api.spotify.com/v1/me/player/seek',
    params: { position_ms: '50000' },
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  axios(params)
    .then(() => {
      dispatch(fetchTrackData());
    })
    .catch((error) => {
      console.log(error);
    });
};
