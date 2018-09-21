import * as types from './types';

export const updateView = (view, e) => ({
  type: types.UPDATE_VIEW,
  view,
  e,
});

export const updateViewSuccess = pageHistory => ({
  type: types.UPDATE_VIEW_SUCCESS,
  pageHistory,
});

export const fetchQueue = () => ({ type: types.FETCH_QUEUE });
export const fetchQueueSuccess = queue => ({
  type: types.FETCH_QUEUE_SUCCESS,
  queue,
});

export const fetchRecentlyPlayed = () => ({ type: types.FETCH_RECENTLY_PLAYED });
export const fetchRecentlyPlayedSuccess = recentlyPlayed => ({
  type: types.FETCH_RECENTLY_PLAYED_SUCCESS,
  recentlyPlayed,
});

export const fetchMostPlayed = () => ({ type: types.FETCH_MOST_PLAYED });
export const fetchMostPlayedSuccess = mostPlayed => ({
  type: types.FETCH_MOST_PLAYED_SUCCESS,
  mostPlayed,
});

export const fetchMySongs = () => ({ type: types.FETCH_MY_SONGS });
export const fetchMySongsSuccess = mySongs => ({
  type: types.FETCH_MY_SONGS_SUCCESS,
  mySongs,
});
