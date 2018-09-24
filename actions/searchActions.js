import * as types from './types';

export const searchTracks = query => ({
  type: types.SEARCH_TRACKS,
  query,
});
export const searchTracksSuccess = results => ({
  type: types.SEARCH_TRACKS_SUCCESS,
  results,
});
export const clearTracks = () => ({ type: types.CLEAR_TRACKS });
