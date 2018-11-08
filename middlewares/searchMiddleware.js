import axios from 'axios';
import * as types from '../actions/types';
import { searchTracksSuccess, clearTracks } from '../actions/searchActions';

const searchTracks = query => (dispatch, getState) => {
  const params = {
    method: 'GET',
    url: 'https://api.spotify.com/v1/search',
    params: {
      q: query,
      type: 'track',
      limit: 50,
    },
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
  };

  axios(params)
    .then((response) => {
      dispatch(searchTracksSuccess(response.data.tracks.items));
    })
    .catch((error) => {
      dispatch(clearTracks());
    });
};

export default store => next => (action) => {
  const result = next(action);
  switch (action.type) {
    case types.SEARCH_TRACKS:
      store.dispatch(searchTracks(action.query));
      break;
    default:
      break;
  }
  return result;
};
