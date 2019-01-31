import * as types from './types';

export const updateView = view => ({
  type: types.UPDATE_VIEW,
  view,
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
  mySongs: mySongs.filter((track, index, self) => self.findIndex(t => t.track.id === track.track.id) === index),
});

export const fetchMyPlaylists = () => ({ type: types.FETCH_MY_PLAYLISTS });
export const fetchMyPlaylistsSuccess = myPlaylists => ({
  type: types.FETCH_MY_PLAYLISTS_SUCCESS,
  myPlaylists,
});

export const fetchPlaylistTracks = playlistId => ({
  type: types.FETCH_PLAYLIST_TRACKS,
  playlistId,
});
export const fetchPlaylistTracksSuccess = playlistId => ({
  type: types.FETCH_PLAYLIST_TRACKS_SUCCESS,
  playlistHash: playlistId,
});

export const fetchPlayHistorySuccess = playHistory => ({
  type: types.FETCH_PLAY_HISTORY_SUCCESS,
  playHistory,
});
