import * as types from './types';

export const login = () => ({ type: types.LOGIN });
export const loginFail = () => ({ type: types.LOGIN_FAIL });
export const loginSuccess = (id, username, avatar) => ({
  type: types.LOGIN_SUCCESS,
  id,
  username,
  avatar,
});
export const updateTokenSuccess = (accessToken, expiresIn) => ({
  type: types.UPDATE_TOKEN_SUCCESS,
  accessToken,
  expiresIn,
});
export const updateTokenFailed = () => ({
  type: types.UPDATE_TOKEN_FAILED,
});

export const load = () => ({ type: types.LOAD });
