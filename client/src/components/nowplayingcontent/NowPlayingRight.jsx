import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addNowPlayingRightEventListeners } from '../event-listeners/now-playing-bar-events';
import Device from './Device';
import { fetchAvailableDevices } from '../../../../actions/devicesActions';

class NowPlayingRight extends Component {
  componentDidMount() {
    addNowPlayingRightEventListeners();
  }

  render() {
    const { devices, hasDevices } = this.props;
    return (
      <div className="now-playing-right">
        <button className="btn-clear btn-devices">
          <i className="material-icons md-light md-24 icon-devices">devices</i>
        </button>
        <div className="devices-menu" style={{ display: 'block' }}>
          <h3 className="devices-menu-header"> Connect to a Device </h3>
          <button className="btn-clear md-18 refresh" onClick={fetchAvailableDevices}>
            <i className="material-icons md-light md-18 icon-refresh">refresh</i>
          </button>
          <ul className="available-devices-list">
            {devices.length
              ? devices.map(device => (
                <Device
                  key={device.id}
                  deviceID={device.id}
                  isActive={device.is_active}
                  name={device.name}
                  volume={device.volume_percent}
                />
              ))
              : null
            }
          </ul>
        </div>
        <div className={`volume-container ${hasDevices ? null : 'disabled'}`}>
          <button className="btn-clear btn-volume">
            <i className="material-icons md-light md-24 icon-volume">volume_up</i>
          </button>
          <div className="progress-bar-clickable volume-bar-clickable">
            <div className="progress-bar">
              <div className="progress-bar-progress" />
              <div className="progress-bar-slider" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  devices: state.devices,
  hasDevices: state.devices.length > 0,
});

const mapDispatchToProps = dispatch => ({
  fetchAvailableDevices: () => dispatch(fetchAvailableDevices()),
});

export default connect(mapStateToProps, mapDispatchToProps)(NowPlayingRight);
