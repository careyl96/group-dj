import * as types from '../actions/types';

const initState = [];

const devicesReducer = (state = initState, action) => {
  switch (action.type) {
    case types.FETCH_AVAILABLE_DEVICES_SUCCESS:
      return action.devices;
    case types.UPDATE_AVAILABLE_DEVICES_SUCCESS:
      return action.devices;
    case types.TRANSFER_PLAYBACK_TO_DEVICE_SUCCESS:
      return action.devices;
    default:
      return state;
  }
};

export default devicesReducer;
