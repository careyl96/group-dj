import axios from 'axios';
import * as types from '../actions/types';
import { fetchQueueSuccess, fetchRecentlyPlayedSuccess, fetchMostPlayedSuccess, fetchMySongsSuccess } from '../actions/viewActions';

const fetchQueue = () => (dispatch) => {
  axios.get('/api/queue')
    .then((queue) => {
      dispatch(fetchQueueSuccess(queue));
    })
    .catch((err) => {
      console.log(err);
    });
};
const fetchRecentlyPlayed = () => (dispatch) => {
  axios.get('/api/recently-played')
    .then((recentlyPlayed) => {
      dispatch(fetchRecentlyPlayedSuccess(recentlyPlayed));
    })
    .catch((err) => {
      console.log(err);
    });
};
const fetchMostPlayed = () => (dispatch) => {
  axios.get('/api/most-played')
    .then((mostPlayed) => {
      dispatch(fetchMostPlayedSuccess(mostPlayed));
    })
    .catch((err) => {
      console.log(err);
    });
};
const fetchMySongs = () => (dispatch, getState) => {
  axios({
    method: 'GET',
    url: 'https://api.spotify.com/v1/me/tracks',
    headers: { Authorization: `Bearer ${getState().session.accessToken}` },
  })
    .then((mySongs) => {
      dispatch(fetchMySongsSuccess(mySongs));
    });
};

export default store => next => (action) => {
  const result = next(action);
  switch (action.type) {
    case types.FETCH_QUEUE:
      store.dispatch(fetchQueue());
      break;
    case types.FETCH_RECENTLY_PLAYED:
      store.dispatch(fetchRecentlyPlayed());
      break;
    case types.FETCH_MOST_PLAYED:
      store.dispatch(fetchMostPlayed());
      break;
    case types.FETCH_MY_SONGS:
      store.dispatch(fetchMySongs());
      break;
    default:
      break;
  }
  return result;
};
