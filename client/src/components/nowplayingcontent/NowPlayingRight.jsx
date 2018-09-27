import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addNowPlayingRightEventListeners } from '../event-listeners/now-playing-bar-events';
import Device from './Device';
import { fetchAvailableDevices } from '../../../../actions/devicesActions';
import { mute, unmute } from '../../../../actions/audioActions';

class NowPlayingRight extends Component {
  constructor() {
    super();
    this.state = {
      volume: 0,
    };
  }

  componentDidMount() {
    addNowPlayingRightEventListeners(this);
  }

  componentWillReceiveProps(newProps) {
    const { devices } = newProps;
    const activeDevice = devices.find(device => device.is_active);
    if (activeDevice) {
      this.setState({ volume: activeDevice.volume_percent });
    }
  }

  renderDevices() {
    const { devices } = this.props;
    if (devices.length) {
      return devices.map((device) => {
        // set volume bar width css to active device volume
        if (device.is_active) {
          const { volume } = this.state;
          const volumeBar = document.querySelector('.volume-bar-clickable');
          const volumeBarProgress = volumeBar.children[0].children[0];
          const volumeBarSlider = volumeBar.children[0].children[1];
          volumeBarProgress.style.width = `${volume}%`;
          volumeBarSlider.style.left = `${volume}%`;
        }

        return (
          <Device
            key={device.id}
            deviceID={device.id}
            isActive={device.is_active}
            name={device.name}
            volume={device.volume_percent}
          />
        );
      });
    }

    return (
      <div className="devices-container disabled">
        <i className="material-icons md-light md-32 disabled">warning</i>
        <div className="device-info">
          <span className="device-info-line1 disabled">No available devices</span>
          <span className="device-info-line2 disabled">Open up Spotify and then click the refresh button</span>
        </div>
      </div>
    );
  }

  renderVolumeIcon() {
    const { volume } = this.state;
    if (volume >= 70) {
      return (<i className="material-icons md-light md-24 icon-volume">volume_up</i>);
    }
    if (volume < 70 && volume >= 20) {
      return (<i className="material-icons md-light md-24 icon-volume">volume_down</i>);
    }
    if (volume < 20 && volume > 0) {
      return (<i className="material-icons md-light md-24 icon-volume">volume_mute</i>);
    }
    return (<i className="material-icons md-light md-24 icon-volume">volume_off</i>);
  }

  render() {
    const { devices, fetchAvailableDevices } = this.props;
    return (
      <div className="now-playing-right">
        <button className="btn-clear btn-devices">
          {devices.length
            ? <i className="material-icons md-light md-24 icon-devices">devices</i>
            : <i className="material-icons md-light md-24 icon-error">error_outline</i>
          }
        </button>
        <div className="devices-menu" style={{ display: 'none' }}>
          <h3 className="devices-menu-header"> Connect to a Device </h3>
          <button className="btn-clear md-18 refresh" onClick={fetchAvailableDevices}>
            <i className="material-icons md-light md-18 icon-refresh">refresh</i>
          </button>
          <ul className="available-devices-list">
            {this.renderDevices()}
          </ul>
        </div>
        <div className={`volume-container ${devices.length ? null : 'disabled'}`}>
          <button className="btn-clear btn-volume" onClick={this.props.muted ? this.props.unmute : () => this.props.mute(this.state.volume)}>
            {this.renderVolumeIcon()}
          </button>
          <div className="progress-bar-clickable volume-bar-clickable">
            <div className="progress-bar">
              <div className="progress-bar-progress" />
              <div className="progress-bar-slider" />
            </div>
          </div>
        </div>
        {/* <div className="state-tracker">{this.state.volume}</div> */}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  devices: state.devices,
  muted: state.audio.muted,
  volume: state.audio.volume,
});

const mapDispatchToProps = dispatch => ({
  fetchAvailableDevices: () => dispatch(fetchAvailableDevices()),
  mute: volume => dispatch(mute(volume)),
  unmute: () => dispatch(unmute()),
});

export default connect(mapStateToProps, mapDispatchToProps)(NowPlayingRight);
