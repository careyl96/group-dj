import * as types from '../actions/types';

const formatPlayingContext = (response) => {
  console.log(response);
  let formattedTrackData = null;
  if (response) {
    formattedTrackData = {
      currentlyPlaying: response.currentlyPlaying,
      startTimestamp: response.startTimestamp,
      lastPausedAt: response.lastPausedAt,
      totalTimePaused: response.totalTimePaused,
      seekDistance: response.seekDistance,
      user: response.user,
      name: response.track.name,
      artists: response.track.artists.map(artist => artist.name).join(', '),
      length: response.track.duration_ms,
      albumArt: response.track.album.images[1].url,
      popularity: response.track.popularity,
      id: response.track.id,
      trackProgress: response.trackProgress,
      fetching: false,
    };
  }
  return formattedTrackData;
};

const initState = {
  currentlyPlaying: false,
  // startTimestamp: 0,
  // lastPausedAt: 0,
  // totalTimePaused: 0,
  // seekDistance: 0,
  user: null,
  name: null,
  artists: null,
  length: 0,
  albumArt: 'https://cdn2.iconfinder.com/data/icons/music-sound-2/512/Music_14-512.png',
  popularity: 0,
  id: null,
  trackProgress: 0,
  fetching: false,
};

const playerReducer = (state = initState, action) => {
  switch (action.type) {
    case types.FETCH_PLAYING_CONTEXT_SUCCESS:
      return formatPlayingContext(action.playingContext) || initState;
    // case types.RESUME_PLAYBACK_SUCCESS:
    // return state;
    // case types.PAUSE_PLAYBACK_SUCCESS:
    // return state;
    case types.SEEK_TRACK:
      return {
        ...state,
        fetching: true,
      };
    default:
      return state;
  }
};

export default playerReducer;
