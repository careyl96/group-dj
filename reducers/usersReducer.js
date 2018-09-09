import * as types from '../actions/types';

const initState = [];

const usersReducer = (state = initState, action) => {
  switch (action.type) {
    case types.UPDATE_USERS:
      return action.users;
    default:
      return state;
  }
};

export default usersReducer;
