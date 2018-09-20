import axios from 'axios';
import * as types from '../actions/types';
import {
  updateViewSuccess,
  fetchQueueSuccess,
  fetchRecentlyPlayedSuccess,
  fetchMostPlayedSuccess,
  fetchMySongsSuccess,
} from '../actions/viewActions';
import pageHistory from './history';

const updateView = view => (dispatch, getState) => {
  if (getState().view.pageHistory.view !== view && view !== 'prev' && view !== 'next') {
    pageHistory.addNode(view);
    dispatch(updateViewSuccess(pageHistory.pageNode));
  } else if (view === 'prev' && getState().view.pageHistory.prev !== null) {
    dispatch(updateViewSuccess(pageHistory.getPrev()));
  } else if (view === 'next' && getState().view.pageHistory.next !== null) {
    dispatch(updateViewSuccess(pageHistory.getNext()));
  }
};
const fetchQueue = () => (dispatch) => {
  axios.get('/api/queue')
    .then((response) => {
      dispatch(fetchQueueSuccess(response.data));
    })
    .catch((err) => {
      console.log(err);
    });
};
const fetchRecentlyPlayed = () => (dispatch) => {
  axios.get('/api/recently-played')
    .then((response) => {
      dispatch(fetchRecentlyPlayedSuccess(response.data));
    })
    .catch((err) => {
      console.log(err);
    });
};
const fetchMostPlayed = () => (dispatch) => {
  axios.get('/api/most-played')
    .then((response) => {
      dispatch(fetchMostPlayedSuccess(response.data));
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
    .then((response) => {
      dispatch(fetchMySongsSuccess(response.data));
    });
};

export default store => next => (action) => {
  const result = next(action);
  switch (action.type) {
    case types.UPDATE_VIEW:
      store.dispatch(updateView(action.view));
      break;
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
