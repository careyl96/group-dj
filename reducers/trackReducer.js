import * as types from '../actions/types';

const initState = {
  currentlyPlaying: null,
  trackName: null,
  artists: null,
  trackLength: null,
  trackProgress: null,
  albumArt: null,
  popularity: null,
};

const trackReducer = (state = initState, action) => {
  switch (action.type) {
    case types.FETCH_TRACK_DATA_SUCCESS:
      return action.trackData;
    case types.RESUME_PLAYBACK_SUCCESS:
      return {
        ...state,
        currentlyPlaying: true,
      };
    case types.PAUSE_PLAYBACK_SUCCESS:
      return {
        ...state,
        currentlyPlaying: false,
      };
    case types.SEEK_TRACK_SUCCESS:
      return {
        ...state,
        trackProgress: action.newTrackPosition,
      };
    case types.SKIP_TRACK_SUCCESS:
      return {
        ...state,
        currentlyPlaying: true,
      };
    case types.FETCH_TRACK_PROGRESS_SUCCESS:
      return {
        ...state,
        trackProgress: action.trackProgress,
      };

    default:
      return state;
  }
};

export default trackReducer;
