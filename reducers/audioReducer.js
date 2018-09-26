import * as types from '../actions/types';

const initState = {
  volume: 0,
  muted: false,
};

const audioReducer = (state = initState, action) => {
  switch (action.type) {
    case types.MUTE_SUCCESS:
      return {
        ...state,
        volume: action.volume,
        muted: true,
      };
    case types.UNMUTE_SUCCESS:
      return {
        ...state,
        muted: false,
      };
    default:
      return state;
  }
};

export default audioReducer;

// click the mute button
// take the value of current volume and save it
// mute the audio
// set muted to true
