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
  fetchMyPlaylistsSuccess,
  fetchPlaylistTracksSuccess,
} from '../actions/viewActions';
import DoublyLinkedList from '../helpers/history';

const pageHistory = new DoublyLinkedList();
pageHistory.addNode('home');

const updateView = view => (dispatch, getState) => {
  if (view === 'prev' && getState().view.pageHistory.prev) {
    dispatch(updateViewSuccess(pageHistory.getPrev()));
    return;
  }
  if (view === 'next' && getState().view.pageHistory.next) {
    dispatch(updateViewSuccess(pageHistory.getNext()));
    return;
  }
  if (view !== getState().view.pageHistory.item && view !== 'prev' && view !== 'next') {
    if (view.indexOf('playlist:') !== -1) {
      const playlistId = view.substr(9);
      pageHistory.addNode(playlistId); // add node to history
    } else {
      pageHistory.addNode(view);
    }
    dispatch(updateViewSuccess(pageHistory.node));
  }
};
const fetchQueue = () => async (dispatch) => {
  try {
    const response = await axios.get('/api/queue');
    dispatch(fetchQueueSuccess(response.data));
  } catch (error) {
    console.log(error);
  }
};
const fetchRecentlyPlayed = () => async (dispatch) => {
  try {
    const response = await axios.get('/api/recently-played');
    dispatch(fetchRecentlyPlayedSuccess(response.data));
  } catch (error) {
    console.log(error);
  }
};
const fetchMostPlayed = () => async (dispatch) => {
  try {
    const response = await axios.get('/saved');
    dispatch(fetchMostPlayedSuccess(response.data.sort((a, b) => b.saved_tracks_play_count - a.saved_tracks_play_count)));
  } catch (error) {
    console.log(error);
  }
};
const fetchMySongs = () => async (dispatch) => {
  const params = {
    method: 'GET',
    url: 'https://api.spotify.com/v1/me/player/recently-played',
    params: { limit: 50 },
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
  };
  try {
    const response = await axios(params);
    dispatch(fetchMySongsSuccess(response.data.items));
  } catch (error) {
    console.log(error);
  }
};
const fetchMyPlaylists = () => async (dispatch, getState) => {
  const params = {
    method: 'GET',
    url: `https://api.spotify.com/v1/users/${getState().session.id}/playlists`,
    params: { limit: 50 },
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
  };

  try {
    const response = await axios(params);
    dispatch(fetchMyPlaylistsSuccess(response.data.items));
  } catch (error) {
    console.log(error);
  }
};

const fetchPlaylistTracks = playlistId => async (dispatch, getState) => {
  const params = {
    method: 'GET',
    url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    params: { limit: 50 },
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
  };

  try {
    const response = await axios(params);
    const playlistHashCopy = { ...getState().view.playlistHash };
    playlistHashCopy[playlistId] = response.data.items;
    dispatch(fetchPlaylistTracksSuccess(playlistHashCopy));
  } catch (error) {
    console.log(error);
  }
};

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
    case types.FETCH_MY_PLAYLISTS:
      store.dispatch(fetchMyPlaylists());
      break;
    case types.FETCH_PLAYLIST_TRACKS:
      store.dispatch(fetchPlaylistTracks(action.playlistId));
      break;
    default:
      break;
  }
  return result;
};


// playlist:asldkfjasdlfkjasfd
// update view
// add new node to history
// fetch id if it's not in playHistory state
// 