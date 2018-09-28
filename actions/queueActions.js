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
export const updateQueue = (oldIndex, newIndex) => ({
  type: types.UPDATE_QUEUE,
  oldIndex,
  newIndex,
});
export const updateQueueSuccess = queue => ({
  type: types.UPDATE_QUEUE_SUCCESS,
  queue,
});
