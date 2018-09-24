import React, { Component } from 'react';
import { connect } from 'react-redux';
import Device from './Device';
import { addEventListeners, updateProgressBar } from './event-listeners/now-playing-bar-events';
import {
  fetchPlayingContext,
  resumePlayback,
  pausePlayback,
  seekTrack,
  skipTrack,
  backTrack,
} from '../../../actions/trackActions';

const parseMs = (ms) => {
  let result = '';
  let minutes = 0;
  let seconds = 0;

  minutes = Math.floor(ms / 1000 / 60);
  seconds = Math.floor((ms / 1000) % 60);

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  result += `${minutes}:${seconds}`;
  return result;
};

class NowPlayingBar extends Component {
  constructor() {
    super();
    this.state = {
      trackProgress: 0,
      length: 0,
      mouseDown: false,
    };
    this.interval = null;
  }

  componentDidMount() {
    addEventListeners(this);
  }

  componentWillReceiveProps(newProps) {
    updateProgressBar(this);
    clearInterval(this.interval);
    const { length } = newProps;
    this.setState({ length });
    if (newProps.currentlyPlaying) {
      this.interval = setInterval(() => updateProgressBar(this), 300);
    }
  }


  render() {
    return (
      <div className="now-playing-wrapper">
        <div className="now-playing-container">
          {/* NOW PLAYING BAR LEFT SIDE - ALBUM ART/TRACK INFO */}
          <div className="now-playing-left">
            <div className="album-art-container">
              <img id="album-art-thumbnail" src={this.props.albumArt} />
            </div>
            <div className="track-info">
              <div className="track-name"> {this.props.name} </div>
              <div className="track-artist"> {this.props.artists} </div>
            </div>
            <button className="control-button add-song">
              <i className="material-icons md-light md-24">add</i>
            </button>
          </div>

          {/* NOW PLAYING CENTER - PLAYER CONTROLS AND PROGRESS BAR */}
          <div className="now-playing-center">
            <div className="player-controls">
              <button className="control-button back" onClick={this.props.backTrack}>
                <i className="material-icons md-light md-36">skip_previous</i>
              </button>

              <button className="control-button play" onClick={this.props.currentlyPlaying ? this.props.pausePlayback : this.props.resumePlayback}>
                {this.props.currentlyPlaying
                  ? <i className="material-icons md-light md-36">pause_circle_outline</i>
                  : <i className="material-icons md-light md-36">play_circle_outline</i>
                }
              </button>

              <button className="control-button skip" onClick={this.props.skipTrack}>
                <i className="material-icons md-light md-36">skip_next</i>
              </button>
            </div>
            <div className="progress-bar-container">
              <button className="icon-small resync" onClick={this.props.fetchPlayingContext}>
                <i className="material-icons md-light md-18">sync</i>
              </button>
              <div className="progress-time">{parseMs(this.state.trackProgress)}</div>
              <div className="progress-bar-clickable" onClick={this.handleClick}>
                <div className="progress-bar">
                  <div className="progress-bar-progress" />
                  <div className="progress-bar-slider" />
                </div>
              </div>
              <div className="progress-time">{parseMs(this.state.length)}</div>
            </div>
          </div>

          <div className="now-playing-right">
            <button className="icon-now-playing-right btn-devices">
              <i className="material-icons md-light md-24 icon-devices">devices</i>
            </button>
            <div className="devices-menu" style={{ display: 'none' }}>
              <h3 className="devices-menu-header"> Connect to a Device </h3>
              <ul className="available-devices-list">
                {this.props.devices
                  ? this.props.devices.map(device => (
                    <Device
                      key={device.id}
                      deviceID={device.id}
                      isActive={device.is_active}
                      name={device.name}
                      volumePercentage={device.volume_percent}
                    />
                  ))
                  : null
                }
              </ul>
            </div>
            <div className="volume-container">
              <button className="icon-now-playing-right btn-volume">
                <i className="material-icons md-light md-24 icon-volume">volume_up</i>
              </button>
              <div className="progress-bar-clickable volume-bar-clickable" onClick={this.handleClick}>
                <div className="progress-bar">
                  <div className="progress-bar-progress" />
                  <div className="progress-bar-slider" />
                </div>
              </div>
            </div>
            <div className="state-tracker">{`${Math.floor(this.state.trackProgress)}`}</div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentlyPlaying: state.playingContext.currentlyPlaying,
  name: state.playingContext.name,
  artists: state.playingContext.artists,
  length: state.playingContext.length,
  albumArt: state.playingContext.albumArt,
  popularity: state.playingContext.popularity,
  devices: state.devices,
});

const mapDispatchToProps = dispatch => ({
  fetchPlayingContext: () => dispatch(fetchPlayingContext()),
  resumePlayback: () => dispatch(resumePlayback()),
  pausePlayback: () => dispatch(pausePlayback()),
  seekTrack: newTrackPosition => dispatch(seekTrack(newTrackPosition)),
  backTrack: () => dispatch(backTrack()),
  skipTrack: () => dispatch(skipTrack()),
});

export default connect(mapStateToProps, mapDispatchToProps)(NowPlayingBar);
