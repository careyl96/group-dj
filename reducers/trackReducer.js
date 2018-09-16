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
  albumArt: null,
  popularity: null,
  id: null,
};

const trackReducer = (state = initState, action) => {
  switch (action.type) {
    case types.FETCH_TRACK_DATA_SUCCESS:
      return action.trackData;
    // case types.RESUME_PLAYBACK_SUCCESS:
    //   return state;
    // case types.PAUSE_PLAYBACK_SUCCESS:
    //   return state;
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
