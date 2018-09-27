import axios from 'axios';
import * as types from '../actions/types';
import {
  adjustVolumeSuccess,
  muteSuccess,
  unmuteSuccess,
} from '../actions/audioActions';

const adjustVolume = volume => (dispatch, getState) => {
  return axios({
    method: 'PUT',
    url: 'https://api.spotify.com/v1/me/player/volume',
    params: { volume_percent: volume },
    headers: { Authorization: `Bearer ${getState().session.accessToken}` },
  })
    .then(() => {
      dispatch(adjustVolumeSuccess(volume));
    })
    .catch((error) => {
      console.log(error);
    });
};
const mute = volume => (dispatch, getState) => {
  if (volume === 0) {
    dispatch(adjustVolume(getState().audio.volume));
  } else {
    dispatch(adjustVolume(0))
      .then(() => {
        dispatch(muteSuccess(volume));
      })
      .catch((error) => {
        console.log(error);
      });
  }
};
const unmute = () => (dispatch, getState) => {
  dispatch(adjustVolume(getState().audio.volume))
    .then(() => {
      dispatch(unmuteSuccess());
    })
    .catch((error) => {
      console.log(error);
    });
};

export default store => next => (action) => {
  const result = next(action);
  switch (action.type) {
    case types.FETCH_AVAILABLE_DEVICES_SUCCESS:
      // action.devices.filter(device => device.is_active))
      break;
    case types.ADJUST_VOLUME:
      store.dispatch(adjustVolume(action.volume));
      break;
    case types.MUTE:
      store.dispatch(mute(action.volume));
      break;
    case types.UNMUTE:
      store.dispatch(unmute());
      break;
    case types.ADJUST_VOLUME_SUCCESS:
      if (store.getState().audio.muted) store.dispatch(unmuteSuccess());
      break;
    case types.TRANSFER_PLAYBACK_TO_DEVICE_SUCCESS:
      if (store.getState().audio.muted) store.dispatch(unmuteSuccess());
      break;
    default:
      break;
  }
  return result;
};

// mute button clicked
// if the track is already muted
  // set volume to unmuted volume
  // set muted = false
// if the track is not muted
  // save current volume 
  // mute track
  // muted = true
// if muted && adjustVolume
  // set muted = false
