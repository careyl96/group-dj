import axios from 'axios';
import * as types from '../actions/types';
import { searchTracksSuccess, clearTracks } from '../actions/searchActions';
import { updateView } from '../actions/sessionActions';

const searchTracks = query => (dispatch, getState) => {
  const params = {
    method: 'GET',
    url: 'https://api.spotify.com/v1/search',
    params: {
      q: query,
      type: 'track',
      limit: 50,
    },
    headers: { Authorization: `Bearer ${getState().session.accessToken}` },
  };

  axios(params)
    .then((response) => {
      dispatch(searchTracksSuccess(response.data.tracks.items));
      // console.log(response.data.tracks.items);
    })
    .catch((error) => {
      console.log(error);
    });
};

export default store => next => (action) => {
  const result = next(action);
  switch (action.type) {
    case types.SEARCH_TRACKS:
      store.dispatch(updateView('search results'));
      store.dispatch(searchTracks(action.query));
      break;
    case types.UPDATE_VIEW:
      if (action.view === 'search results') {
        store.dispatch(clearTracks());
      }
      break;
    default:
      break;
  }
  return result;
};

// export const validateAccount = () => (dispatch) => {
//   // dispatch(login()); // doesn't do anything yet
//   const accessToken = queryString.parse(window.location.search).access_token;
//   if (accessToken) {
//     const params = {
//       method: 'GET',
//       url: 'https://api.spotify.com/v1/me/',
//       headers: { Authorization: `Bearer ${accessToken}` },
//     };

//     axios(params)
//       .then((response) => {
//         const user = response.data.display_name;
//         dispatch(updateTokenSuccess(accessToken, user));
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }
// };
