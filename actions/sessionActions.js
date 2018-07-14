import axios from 'axios';
import queryString from 'query-string';
import * as types from './types';

export const login = () => ({ type: types.LOGIN });
export const loginFail = () => ({ type: types.LOGIN_FAIL });
export const loginSuccess = (accessToken, user) => ({
  type: types.LOGIN_SUCCESS,
  accessToken,
  user,
});

export const validateAccount = () => (dispatch) => {
  // dispatch(login()); // doesn't do anything yet
  const accessToken = queryString.parse(window.location.search).access_token;
  if (accessToken) {
    const params = {
      method: 'GET',
      url: 'https://api.spotify.com/v1/me/',
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    axios(params)
      .then((response) => {
        const user = response.data.display_name;
        dispatch(loginSuccess(accessToken, user));
      })
      .catch((error) => {
        console.log(error);
      });
  }
};
