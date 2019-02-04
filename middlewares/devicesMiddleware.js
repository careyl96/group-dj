import axios from 'axios';
import * as types from '../actions/types';
import { fetchPlayingContext } from '../actions/playerActions';
import {
  fetchAvailableDevicesSuccess,
  updateAvailableDevicesSuccess,
  transferPlaybackToDeviceSuccess,
} from '../actions/devicesActions';

const fetchAvailableDevices = () => (dispatch) => {
  const params = {
    method: 'GET',
    url: 'https://api.spotify.com/v1/me/player/devices',
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
  };
  return axios(params)
    .then((response) => {
      dispatch(fetchAvailableDevicesSuccess(response.data.devices));
    })
    .catch((error) => {
    });
};
const transferPlaybackToDevice = deviceId => (dispatch, getState) => {
  const params = {
    method: 'PUT',
    url: 'https://api.spotify.com/v1/me/player',
    data: {
      device_ids: [deviceId],
    },
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
  };
  return axios(params)
    .then(() => {
      const devices = getState().devices.map(device => ((device.id === deviceId) ? { ...device, is_active: true } : { ...device, is_active: false }));
      dispatch(transferPlaybackToDeviceSuccess(devices));
    })
    .catch((error) => {
      console.log(error);
    });
};

export default store => next => (action) => {
  const result = next(action);
  switch (action.type) {
    case types.FETCH_AVAILABLE_DEVICES:
      store.dispatch(fetchAvailableDevices());
      break;
    case types.FETCH_AVAILABLE_DEVICES_SUCCESS:
      if (action.devices.length && action.devices.every(device => device.is_active === false)) {
        store.dispatch(transferPlaybackToDevice(action.devices[0].id));
      }
      break;
    case types.TRANSFER_PLAYBACK_TO_DEVICE:
      store.dispatch(transferPlaybackToDevice(action.deviceId));
      break;
    case types.TRANSFER_PLAYBACK_TO_DEVICE_SUCCESS:
      setTimeout(() => { store.dispatch(fetchPlayingContext()); }, 1000);
      break;
    case types.ADJUST_VOLUME_SUCCESS:
      // set the volume property of the active device to action.volume
      store.dispatch(updateAvailableDevicesSuccess(store.getState().devices.map(device => ((device.is_active) ? { ...device, volume_percent: action.volume } : device))));
      break;
    default:
      break;
  }
  return result;
};
