import * as types from '../actions/types';

const initState = {
  accessToken: null,
  expiresIn: null,
  user: null,
  userID: null,
  userImg: null,
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
        userImg: action.userImg,
      };
    case types.UPDATE_TIME:
      return {
        ...state,
        timeDifference: action.timeDifference,
      };
    default:
      return state;
  }
};

export default sessionReducer;
