import * as types from '../actions/types';

const initState = {
  pageHistory: {
    prev: null,
    item: 'home',
    next: null,
  },
  queue: [],
  recentlyPlayed: [],
  mostPlayed: [],
  mySongs: [],
};

const viewReducer = (state = initState, action) => {
  switch (action.type) {
    case types.UPDATE_VIEW_SUCCESS:
      return {
        ...state,
        pageHistory: action.pageHistory,
      };
    case types.FETCH_QUEUE_SUCCESS:
      return {
        ...state,
        queue: action.queue,
      };
    case types.FETCH_RECENTLY_PLAYED_SUCCESS:
      return {
        ...state,
        recentlyPlayed: action.recentlyPlayed,
      };
    case types.FETCH_MOST_PLAYED_SUCCESS:
      return {
        ...state,
        mostPlayed: action.mostPlayed,
      };
    case types.FETCH_MY_SONGS_SUCCESS:
      return {
        ...state,
        mySongs: action.mySongs,
      };
    default:
      return state;
  }
};

export default viewReducer;
