import * as types from '../actions/types';

const initState = {
  currentlyPlaying: null,
  startTimestamp: null,
  lastPausedAt: null,
  totalTimePaused: null,
  seekDistance: null,
  userID: null,
  name: null,
  artists: null,
  length: null,
  albumArt: 'https://image.freepik.com/free-icon/black-music-icon_318-9277.jpg',
  popularity: null,
  id: null,
};

const trackReducer = (state = initState, action) => {
  switch (action.type) {
    case types.FETCH_TRACK_DATA_SUCCESS:
      return action.trackData || initState;
    case types.PLAY_TRACK_SUCCESS:
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
