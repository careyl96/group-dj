import * as types from '../actions/types';

const initState = {
  view: null,
  queue: [],
  recentlyPlayed: [],
  mostPlayed: [],
  mySongs: [],
};

const viewReducer = (state = initState, action) => {
  switch (action.type) {
    case types.UPDATE_VIEW:
      return {
        ...state,
        view: action.view,
      };
    default:
      return state;
  }
};

export default viewReducer;
