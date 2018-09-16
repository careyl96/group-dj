import * as types from '../actions/types';

const initState = {
  results: [],
};

const searchReducer = (state = initState, action) => {
  switch (action.type) {
    case types.SEARCH_TRACKS_SUCCESS:
      return {
        results: action.results,
      };
    case types.CLEAR_TRACKS:
      return {
        results: [],
      };
    default:
      return state;
  }
};

export default searchReducer;
