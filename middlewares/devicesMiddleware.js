import axios from 'axios';
import * as types from '../actions/types';
import { fetchPlayingContext } from '../actions/trackActions';
import {
  fetchAvailableDevicesSuccess,
  updateAvailableDevicesSuccess,
  transferPlaybackToDeviceSuccess,
} from '../actions/devicesActions';

const fetchAvailableDevices = () => (dispatch, getState) => {
  return axios({
    method: 'GET',
    url: 'https://api.spotify.com/v1/me/player/devices',
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
  })
    .then((response) => {
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
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
  })
    .then(() => {
      const devices = getState().devices.map(device => ((device.id === deviceID) ? { ...device, is_active: true } : { ...device, is_active: false }));
      dispatch(transferPlaybackToDeviceSuccess(devices));
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
    case types.FETCH_AVAILABLE_DEVICES_SUCCESS:
      if (action.devices.length && action.devices.every(device => device.is_active === false)) {
        store.dispatch(transferPlaybackToDevice(action.devices[0].id));
      }
      break;
    case types.TRANSFER_PLAYBACK_TO_DEVICE:
      store.dispatch(transferPlaybackToDevice(action.deviceID));
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
