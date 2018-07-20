import * as types from './types';

export const login = () => ({ type: types.LOGIN });
export const loginFail = () => ({ type: types.LOGIN_FAIL });
export const loginSuccess = accessToken => ({
  type: types.LOGIN_SUCCESS,
  accessToken,
});

export const load = () => ({ type: types.LOAD });
