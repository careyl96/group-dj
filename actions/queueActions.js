import * as types from './types';

export const queueTrack = (track, user) => ({
  type: types.QUEUE_TRACK,
  track,
  user,
});
export const removeTrack = track => ({
  type: types.REMOVE_TRACK,
  track,
});
