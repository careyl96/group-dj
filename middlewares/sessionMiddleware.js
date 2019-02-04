import axios from 'axios';
import config from '../auth/config';
import * as types from '../actions/types';
import { updateView } from '../actions/viewActions';
import { updateTokenSuccess, updateTokenFailed, loginSuccess } from '../actions/sessionActions';

const updateToken = () => (dispatch) => {
  dispatch({ type: types.UPDATE_TOKEN });
  axios.get(`${config.HOST}/auth/token`)
    .then((response) => {
      const { access_token, expires_in } = response.data;
      localStorage.setItem('user', true);
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('expires_in', expires_in);
      dispatch(updateTokenSuccess());
      setTimeout(() => updateToken()(dispatch), 3000000);
    })
    .catch((error) => {
      localStorage.setItem('user', false);
      dispatch(updateTokenFailed());
    });
};

const getCurrentUserInfo = () => (dispatch) => {
  const params = {
    method: 'GET',
    url: 'https://api.spotify.com/v1/me',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  };
  return axios(params)
    .then((response) => {
      const user = {
        id: response.data.id,
        username: response.data.display_name,
        avatar: response.data.images[0] ? response.data.images[0].url : 'https://cdn.drawception.com/images/panels/2017/1-2/AWGwyTG2QZ-8.png',
      };
      dispatch(loginSuccess(user));
    })
    .catch((error) => {
      console.log(`failed to get user information ${error}`);
    });
};

export default store => next => (action) => {
  const result = next(action);
  switch (action.type) {
    case types.LOGIN:
      window.location = `${config.HOST}/auth/login`;
      break;
    case types.LOAD:
      store.dispatch(updateToken());
      break;
    case types.UPDATE_TOKEN_SUCCESS:
      store.dispatch(getCurrentUserInfo());
      break;
    case types.UPDATE_TOKEN_FAILED:
      console.log('failed bro');
      store.dispatch(updateView('home'));
      break;
    default:
      break;
  }
  return result;
};
