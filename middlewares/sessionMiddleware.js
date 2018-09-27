import axios from 'axios';
import config from '../auth/config';
import * as types from '../actions/types';
import { updateUserID, updateTokenSuccess, loginSuccess } from '../actions/sessionActions';

const parseMs = (ms) => {
  let result = '';
  let minutes = 0;
  let seconds = 0;

  minutes = Math.floor(ms / 1000 / 60);
  seconds = Math.floor((ms / 1000) % 60);

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  result += `${minutes}:${seconds}`;
  return result;
};

const updateToken = () => (dispatch) => {
  return axios.get(`${config.HOST}/auth/token`)
    .then((response) => {
      if (!response.data) return;
      const { access_token, expires_in, user_id } = response.data;
      dispatch(updateTokenSuccess(access_token, expires_in));
      dispatch(updateUserID(user_id));
    });
};
const getCurrentUserInfo = () => (dispatch, getState) => {
  const params = {
    headers: {
      Authorization: `Bearer ${getState().session.accessToken}`,
    },
  };
  return axios.get('https://api.spotify.com/v1/me', params)
    .then((response) => {
      const username = response.data.display_name;
      const avatar = response.data.images[0].url;
      dispatch(loginSuccess(username, avatar));
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
      store.dispatch(updateToken())
        .then(() => {
          store.dispatch(getCurrentUserInfo());
          setInterval(() => store.dispatch(updateToken()), 3000000);
        });
      break;
    default:
      break;
  }
  return result;
};

// export const validateAccount = () => (dispatch) => {
//   // dispatch(login()); // doesn't do anything yet
//   const accessToken = queryString.parse(window.location.search).access_token;
//   if (accessToken) {
//     const params = {
//       method: 'GET',
//       url: 'https://api.spotify.com/v1/me/',
//       headers: { Authorization: `Bearer ${accessToken}` },
//     };

//     axios(params)
//       .then((response) => {
//         const user = response.data.display_name;
//         dispatch(updateTokenSuccess(accessToken, user));
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }
// };
