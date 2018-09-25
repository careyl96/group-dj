import * as types from './types';

export const fetchPlayingContext = () => ({ type: types.FETCH_PLAYING_CONTEXT });
export const fetchPlayingContextSuccess = playingContext => ({
  type: types.FETCH_PLAYING_CONTEXT_SUCCESS,
  playingContext,
});

export const overridePlayingContext = (track, user) => ({
  type: types.OVERRIDE_PLAYING_CONTEXT,
  track,
  user,
});

export const resumePlayback = () => ({ type: types.RESUME_PLAYBACK });
export const resumePlaybackSuccess = () => ({ type: types.RESUME_PLAYBACK_SUCCESS });

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

export const adjustVolume = volume => ({
  type: types.ADJUST_VOLUME,
  volume,
});
export const adjustVolumeSuccess = volume => ({
  type: types.ADJUST_VOLUME_SUCCESS,
  volume,
});
