import * as types from './types';

export const login = () => ({ type: types.LOGIN });
export const loginFail = () => ({ type: types.LOGIN_FAIL });
export const loginSuccess = (user, userImg) => ({
  type: types.LOGIN_SUCCESS,
  user,
  userImg,
});
export const updateTokenSuccess = (accessToken, refreshToken, expiresIn) => ({
  type: types.UPDATE_TOKEN_SUCCESS,
  accessToken,
  refreshToken,
  expiresIn,
});

export const load = () => ({ type: types.LOAD });

export const updateView = view => ({
  type: types.UPDATE_VIEW,
  view,
});
