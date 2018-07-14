import * as types from '../actions/types';

const initState = {
  accessToken: null,
  user: null,
  userImg: null,
};

const sessionReducer = (state = initState, action) => {
  switch (action.type) {
    case types.LOGIN_SUCCESS:
      return {
        ...state,
        accessToken: action.accessToken,
        user: action.user,
      };
    default:
      return state;
  }
};

export default sessionReducer;
