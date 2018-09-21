import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addEventListeners, updateProgressBar } from './event-listeners/now-playing-bar-events';
import {
  fetchPlayingContext,
  resumeTrack,
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
            <button className="control-button add-song">+</button>
          </div>

          {/* NOW PLAYING CENTER - PLAYER CONTROLS AND PROGRESS BAR */}
          <div className="now-playing-center">
            <div className="player-controls">
              <button className="control-button back" onClick={this.props.backTrack}>
                <i className="material-icons md-light md-36">skip_previous</i>
              </button>

              <button className="control-button play" onClick={this.props.currentlyPlaying ? this.props.pausePlayback : this.props.resumeTrack}>
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
              <button className="resync" onClick={this.props.fetchPlayingContext}>
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
            <div className="state-tracker">{`Track Length: ${this.state.length}`}</div>
            <div className="state-tracker">{`Track Progress: ${Math.floor(this.state.trackProgress)}`}</div>
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
  albumArt: state.playingContext.albumArt,
  popularity: state.playingContext.popularity,
});
const mapDispatchToProps = dispatch => ({
  fetchPlayingContext: () => dispatch(fetchPlayingContext()),
  resumeTrack: () => dispatch(resumeTrack()),
  pausePlayback: () => dispatch(pausePlayback()),
  seekTrack: newTrackPosition => dispatch(seekTrack(newTrackPosition)),
  backTrack: () => dispatch(backTrack()),
  skipTrack: () => dispatch(skipTrack()),
});

export default connect(mapStateToProps, mapDispatchToProps)(NowPlayingBar);
