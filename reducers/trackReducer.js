import * as types from '../actions/types';

const formatPlayingContext = (response) => {
  let formattedTrackData = null;
  // if (Object.prototype.hasOwnProperty.call(response, 'track')) {
  if (response) {
    formattedTrackData = {
      currentlyPlaying: response.currentlyPlaying,
      startTimestamp: response.startTimestamp,
      lastPausedAt: response.lastPausedAt,
      totalTimePaused: response.totalTimePaused,
      seekDistance: response.seekDistance,
      userID: response.userID,
      name: response.track.name,
      artists: response.track.artists.map(artist => artist.name).join(', '),
      length: response.track.duration_ms,
      albumArt: response.track.album.images[1].url,
      popularity: response.track.popularity,
      id: response.track.id,
    };
  }
  return formattedTrackData;
};

const initState = {
  currentlyPlaying: false,
  startTimestamp: 0,
  lastPausedAt: 0,
  totalTimePaused: 0,
  seekDistance: 0,
  userID: null,
  name: null,
  artists: null,
  length: 0,
  albumArt: 'https://img.clipartxtras.com/4b0119488ad3c9a7aca68a3759b234ed_music-notes-no-background-music-note-clipart-transparent-background_512-512.png',
  popularity: 0,
  id: null,
};

const trackReducer = (state = initState, action) => {
  switch (action.type) {
    case types.FETCH_PLAYING_CONTEXT_SUCCESS:
      return formatPlayingContext(action.playingContext) || initState;
    case types.RESUME_TRACK_SUCCESS:
      return state;
    case types.PAUSE_PLAYBACK_SUCCESS:
      return state;
    // case types.SEEK_TRACK_SUCCESS:
    //   return {
    //     ...state,
    //     startTimestamp: action.newTrackPosition,
    //   };
    // case types.SKIP_TRACK_SUCCESS:
    //   return {
    //     ...state,
    //     currentlyPlaying: true,
    //   };
    default:
      return state;
  }
};

export default trackReducer;
