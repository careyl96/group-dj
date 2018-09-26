import * as types from './types';

export const mute = volume => ({
  type: types.MUTE,
  volume,
});
export const muteSuccess = volume => ({
  type: types.MUTE_SUCCESS,
  volume,
});

export const unmute = volume => ({
  type: types.UNMUTE,
  volume,
});
export const unmuteSuccess = () => ({ type: types.UNMUTE_SUCCESS });

export const adjustVolume = volume => ({
  type: types.ADJUST_VOLUME,
  volume,
});
export const adjustVolumeSuccess = volume => ({
  type: types.ADJUST_VOLUME_SUCCESS,
  volume,
});
