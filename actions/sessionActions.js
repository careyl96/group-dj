import * as types from './types';

export const login = () => ({ type: types.LOGIN });
export const loginFail = () => ({ type: types.LOGIN_FAIL });
export const loginSuccess = (user, avatar) => ({
  type: types.LOGIN_SUCCESS,
  user,
  avatar,
});
export const updateTokenSuccess = (accessToken, expiresIn) => ({
  type: types.UPDATE_TOKEN_SUCCESS,
  accessToken,
  expiresIn,
});
export const updateTime = timeDifference => ({
  type: types.UPDATE_TIME,
  timeDifference,
});

export const load = () => ({ type: types.LOAD });
