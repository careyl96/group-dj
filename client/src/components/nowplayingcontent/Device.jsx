import React from 'react';
import { connect } from 'react-redux';
import { transferPlaybackToDevice } from '../../../../actions/devicesActions';

const adjustVolumeSlider = (volume) => {
  const volumeBar = document.querySelector('.volume-bar-clickable');
  const volumeBarProgress = volumeBar.children[0].children[0];
  const volumeBarSlider = volumeBar.children[0].children[1];
  volumeBarProgress.style.width = `${volume}%`;
  volumeBarSlider.style.left = `${volume}%`;
};

const Device = ({ deviceID, isActive, name, volume, transferPlaybackToDevice }) => {
  if (isActive) {
    adjustVolumeSlider(volume);
    return (
      <li className="available-device">
        <div className="device-container">
          <i className="material-icons md-light md-32 icon-devices highlighted">devices</i>
          <div className="device-info">
            <div className="device-info-line1 highlighted">Listening On</div>
            <div className="device-info-line2 highlighted">{name}</div>
          </div>
        </div>
      </li>
    );
  }
  return (
    <li className="available-device">
      <div className="device-container" onClick={() => transferPlaybackToDevice(deviceID)}>
        <i className="material-icons md-light md-32 icon-devices">devices</i>
        <div className="device-info">
          <div className="device-info-line1">{name}</div>
          <div className="device-info-line2">Spotify Connect</div>
        </div>
      </div>
    </li>
  );
};

const mapDispatchToProps = dispatch => ({
  transferPlaybackToDevice: deviceID => dispatch(transferPlaybackToDevice(deviceID)),
});

export default connect(null, mapDispatchToProps)(Device);
