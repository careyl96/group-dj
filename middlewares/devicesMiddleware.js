import axios from 'axios';
import * as types from '../actions/types';
import { fetchAvailableDevicesSuccess, transferPlaybackToDeviceSuccess } from '../actions/devicesActions';

const fetchAvailableDevices = () => (dispatch, getState) => {
  return axios({
    method: 'GET',
    url: 'https://api.spotify.com/v1/me/player/devices',
    headers: { Authorization: `Bearer ${getState().session.accessToken}` },
  })
    .then((response) => {
      console.log(response.data.devices);
      dispatch(fetchAvailableDevicesSuccess(response.data.devices));
    })
    .catch((error) => {
    });
};
const transferPlaybackToDevice = deviceID => (dispatch, getState) => {
  return axios({
    method: 'PUT',
    url: 'https://api.spotify.com/v1/me/player',
    data: {
      device_ids: [deviceID],
    },
    headers: { Authorization: `Bearer ${getState().session.accessToken}` },
  })
    .then(() => {
      dispatch(transferPlaybackToDeviceSuccess())
    })
    .catch((error) => {
    });
};

export default store => next => (action) => {
  const result = next(action);
  switch (action.type) {
    case types.FETCH_AVAILABLE_DEVICES:
      store.dispatch(fetchAvailableDevices());
      break;
    case types.TRANSFER_PLAYBACK_TO_DEVICE:
      store.dispatch(transferPlaybackToDevice(action.deviceID))
        .then(() => {
          setTimeout(() => store.dispatch(fetchAvailableDevices()), 500);
        });
      break;
    default:
      break;
  }
  return result;
};
