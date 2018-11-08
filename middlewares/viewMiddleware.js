import axios from 'axios';
import { arrayMove } from 'react-sortable-hoc';
import * as types from '../actions/types';
import { updateQueueSuccess } from '../actions/queueActions';
import {
  updateViewSuccess,
  fetchQueueSuccess,
  fetchRecentlyPlayedSuccess,
  fetchMostPlayedSuccess,
  fetchMySongsSuccess,
} from '../actions/viewActions';
import DoublyLinkedList from '../helpers/history';

const pageHistory = new DoublyLinkedList();
pageHistory.addNode('home');

const updateView = view => (dispatch, getState) => {
  if (view !== getState().view.pageHistory.item && view !== 'prev' && view !== 'next') {
    pageHistory.addNode(view);
    dispatch(updateViewSuccess(pageHistory.node));
  } else if (view === 'prev' && getState().view.pageHistory.prev) {
    dispatch(updateViewSuccess(pageHistory.getPrev()));
  } else if (view === 'next' && getState().view.pageHistory.next) {
    dispatch(updateViewSuccess(pageHistory.getNext()));
  }
};
const fetchQueue = () => (dispatch) => {
  axios.get('/api/queue')
    .then((response) => {
      dispatch(fetchQueueSuccess(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
};
const fetchRecentlyPlayed = () => (dispatch) => {
  axios.get('/api/recently-played')
    .then((response) => {
      dispatch(fetchRecentlyPlayedSuccess(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
};
const fetchMostPlayed = () => (dispatch) => {
  axios.get('/saved')
    .then((response) => {
      dispatch(fetchMostPlayedSuccess(response.data.sort((a, b) => b.saved_tracks_play_count - a.saved_tracks_play_count)));
    })
    .catch((error) => {
      console.log(error);
    });
};
const fetchMySongs = () => (dispatch, getState) => axios({
    method: 'GET',
    url: 'https://api.spotify.com/v1/me/top/tracks',
    params: { limit: 50 },
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
  })
    .then((response) => {
      dispatch(fetchMySongsSuccess(response.data.items));
    })
    .catch((error) => {
      console.log(error);
    });
const updateQueue = (oldIndex, newIndex) => (dispatch, getState) => {
  const queue = arrayMove(getState().view.queue, oldIndex, newIndex);
  dispatch(updateQueueSuccess(queue));
};

export default store => next => (action) => {
  const result = next(action);
  switch (action.type) {
    case types.UPDATE_VIEW:
      store.dispatch(updateView(action.view, action.item));
      break;
    case types.UPDATE_QUEUE:
      store.dispatch(updateQueue(action.oldIndex, action.newIndex));
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
