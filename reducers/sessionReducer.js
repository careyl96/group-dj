import * as types from '../actions/types';

const initState = {
  accessToken: null,
  expiresIn: null,
  user: null,
  id: null,
  avatar: null,
  timeDifference: 0,
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
      };
    case types.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.user,
        avatar: action.avatar,
      };
    case types.UPDATE_USER_ID:
      return {
        ...state,
        id: action.id,
      };
    default:
      return state;
  }
};

export default sessionReducer;
