import * as types from './types';

export const login = () => ({ type: types.LOGIN });
export const loginFail = () => ({ type: types.LOGIN_FAIL });
export const loginSuccess = (username, avatar) => ({
  type: types.LOGIN_SUCCESS,
  username,
  avatar,
});
export const updateUserID = id => ({
  type: types.UPDATE_USER_ID,
  id,
});
export const updateTokenSuccess = (accessToken, expiresIn) => ({
  type: types.UPDATE_TOKEN_SUCCESS,
  accessToken,
  expiresIn,
});

export const load = () => ({ type: types.LOAD });
