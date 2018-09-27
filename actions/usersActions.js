import * as types from './types';

export const updateUsers = users => ({
  type: types.UPDATE_USERS,
  users,
});
