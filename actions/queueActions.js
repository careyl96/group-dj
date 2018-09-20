import * as types from './types';

export const queueTrack = track => ({
  type: types.QUEUE_TRACK,
  track,
});
export const removeTrack = track => ({
  type: types.REMOVE_TRACK,
  track,
});
