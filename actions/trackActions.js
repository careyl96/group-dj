import axios from 'axios';
import * as types from './types';

export const fetchPlayingContext = () => ({ type: types.FETCH_PLAYING_CONTEXT });
export const fetchPlayingContextSuccess = playingContext => ({
  type: types.FETCH_PLAYING_CONTEXT_SUCCESS,
  playingContext,
});

export const overridePlayingContext = (track, userID) => ({
  type: types.OVERRIDE_PLAYING_CONTEXT,
  track,
  userID,
});

export const resumeTrack = () => ({ type: types.RESUME_TRACK });
export const resumeTrackSuccess = () => ({ type: types.RESUME_TRACK_SUCCESS });

export const pausePlayback = () => ({ type: types.PAUSE_PLAYBACK });
export const pausePlaybackSuccess = () => ({ type: types.PAUSE_PLAYBACK_SUCCESS });

export const backTrack = () => ({ type: types.BACK_TRACK });
export const backTrackSuccess = () => ({ type: types.BACK_TRACK_SUCCESS });

export const skipTrack = () => ({ type: types.SKIP_TRACK });
export const skipTrackSuccess = () => ({ type: types.SKIP_TRACK_SUCCESS });

export const seekTrack = newTrackPosition => ({
  type: types.SEEK_TRACK,
  newTrackPosition,
});
export const seekTrackSuccess = newTrackPosition => ({
  type: types.SEEK_TRACK_SUCCESS,
  newTrackPosition,
});
