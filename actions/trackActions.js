import axios from 'axios';
import * as types from './types';

export const fetchTrackData = () => ({ type: types.FETCH_TRACK_DATA });
export const fetchTrackDataSuccess = trackData => ({
  type: types.FETCH_TRACK_DATA_SUCCESS,
  trackData,
});

export const overridePlayingContext = (track, userID) => ({
  type: types.OVERRIDE_PLAYING_CONTEXT,
  track,
  userID,
});

export const resumePlayback = () => ({ type: types.RESUME_PLAYBACK });
export const resumePlaybackSuccess = () => ({ type: types.RESUME_PLAYBACK_SUCCESS });

export const pausePlayback = () => ({ type: types.PAUSE_PLAYBACK });
export const pausePlaybackSuccess = () => ({ type: types.PAUSE_PLAYBACK_SUCCESS });

export const fetchPreviousTrack = () => ({ type: types.FETCH_PREVIOUS_TRACK });
export const fetchPreviousTrackSuccess = () => ({ type: types.FETCH_PREVIOUS_TRACK_SUCCESS });

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
export const skipTrackSuccess = () => ({ type: types.SKIP_TRACK_SUCCESS });

export const seekTrack = newTrackPosition => ({
  type: types.SEEK_TRACK,
  newTrackPosition,
});
export const seekTrackSuccess = newTrackPosition => ({
  type: types.SEEK_TRACK_SUCCESS,
  newTrackPosition,
});
