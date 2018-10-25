import * as types from '../actions/types';

const initState = {
  accessToken: null,
  expiresIn: null,
  id: null,
  username: null,
  avatar: null,
  fetchingUser: true,
  fetching: true,
};

const sessionReducer = (state = initState, action) => {
  switch (action.type) {
    case types.LOAD:
      if (!process.browser) return state;
      return {
        ...state,
        accessToken: action.accessToken,
      };
    case types.UPDATE_TOKEN_SUCCESS:
      return {
        ...state,
        accessToken: action.accessToken,
        expiresIn: action.expiresIn,
        fetchingUser: false,
      };
    case types.UPDATE_TOKEN_FAILED:
      return {
        ...state,
        fetchingUser: false,
      };
    case types.LOGIN_SUCCESS:
      return {
        ...state,
        id: action.id,
        username: action.username,
        avatar: action.avatar,
      };
    case types.UPDATE_USER_ID:
      return {
        ...state,
        id: action.id,
      };
    case types.FETCH_AVAILABLE_DEVICES:
      return {
        ...state,
        fetching: true,
      };
    case types.FETCH_AVAILABLE_DEVICES_SUCCESS:
      return {
        ...state,
        fetching: false,
      };
    case types.UPDATE_AVAILABLE_DEVICES_SUCCESS:
      return {
        ...state,
        fetching: false,
      };
    default:
      return state;
  }
};

export default sessionReducer;
