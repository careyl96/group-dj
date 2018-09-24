import * as types from './types';

export const updateUsers = users => ({
  type: types.UPDATE_USERS,
  users,
});

export const updateUserID = id => ({
  type: types.UPDATE_USER_ID,
  id,
});
