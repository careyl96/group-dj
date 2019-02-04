import React from 'react';
import { connect } from 'react-redux';
import { transferPlaybackToDevice } from '../../../../actions/devicesActions';

const Device = ({ deviceId, isActive, name, transferPlaybackToDevice }) => {
  if (isActive) {
    return (
      <li className="available-device">
        <div className="devices-container">
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
      <div className="devices-container" role="button" tabIndex={0} onClick={() => transferPlaybackToDevice(deviceId)}>
        <i className="material-icons md-light md-32 icon-devices">devices</i>
        <div className="device-info">
          <span className="device-info-line1">{name}</span>
          <span className="device-info-line2">Spotify Connect</span>
        </div>
      </div>
    </li>
  );
};

const mapDispatchToProps = dispatch => ({
  transferPlaybackToDevice: deviceId => dispatch(transferPlaybackToDevice(deviceId)),
});

export default connect(null, mapDispatchToProps)(Device);
