import axios from 'axios';
import * as types from '../actions/types';
import { updateAvailableDevicesSuccess, transferPlaybackToDeviceSuccess } from '../actions/devicesActions';
import { fetchPlayingContext } from '../actions/trackActions';

const fetchAvailableDevices = () => (dispatch, getState) => {
  return axios({
    method: 'GET',
    url: 'https://api.spotify.com/v1/me/player/devices',
    headers: { Authorization: `Bearer ${getState().session.accessToken}` },
  })
    .then((response) => {
      dispatch(updateAvailableDevicesSuccess(response.data.devices));
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
      const devices = getState().devices.map(device => ((device.id === deviceID) ? { ...device, is_active: true } : { ...device, is_active: false }));
      dispatch(transferPlaybackToDeviceSuccess(devices));
    })
    .catch((error) => {
    });
};

export default store => next => (action) => {
  const result = next(action);
  let devices = null;
  switch (action.type) {
    case types.FETCH_AVAILABLE_DEVICES:
      store.dispatch(fetchAvailableDevices());
      break;
    case types.UPDATE_AVAILABLE_DEVICES_SUCCESS:
      devices = action.devices;
      if (devices && devices.every(device => device.is_active === false)) {
        store.dispatch(transferPlaybackToDevice(devices[0].id));
      }
      break;
    case types.TRANSFER_PLAYBACK_TO_DEVICE:
      store.dispatch(transferPlaybackToDevice(action.deviceID));
      break;
    case types.TRANSFER_PLAYBACK_TO_DEVICE_SUCCESS:
      setTimeout(() => { store.dispatch(fetchPlayingContext()); }, 2000);
      break;
    case types.ADJUST_VOLUME_SUCCESS:
      devices = store.getState().devices.map(device => ((device.is_active) ? { ...device, volume_percent: action.volume } : device));
      store.dispatch(updateAvailableDevicesSuccess(devices));
      break;
    default:
      break;
  }
  return result;
};
