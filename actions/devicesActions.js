import * as types from './types';

export const fetchAvailableDevices = () => ({
  type: types.FETCH_AVAILABLE_DEVICES,
});
export const fetchAvailableDevicesSuccess = devices => ({
  type: types.FETCH_AVAILABLE_DEVICES_SUCCESS,
  devices,
});
export const updateAvailableDevicesSuccess = devices => ({
  type: types.UPDATE_AVAILABLE_DEVICES_SUCCESS,
  devices,
});

export const transferPlaybackToDevice = deviceId => ({
  type: types.TRANSFER_PLAYBACK_TO_DEVICE,
  deviceId,
});
export const transferPlaybackToDeviceSuccess = devices => ({
  type: types.TRANSFER_PLAYBACK_TO_DEVICE_SUCCESS,
  devices,
});
