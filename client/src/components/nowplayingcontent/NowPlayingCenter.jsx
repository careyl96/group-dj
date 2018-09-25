import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addNowPlayingCenterEventListeners, updateProgressBar } from '../event-listeners/now-playing-bar-events';
import {
  fetchPlayingContext,
  resumePlayback,
  pausePlayback,
  skipTrack,
  backTrack,
} from '../../../../actions/trackActions';

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

class NowPlayingCenter extends Component {
  constructor() {
    super();
    this.state = {
      trackProgress: 0,
      mouseDown: false,
    };
    this.interval = null;
  }

  componentDidMount() {
    addNowPlayingCenterEventListeners(this);
  }

  componentWillReceiveProps(newProps) {
    updateProgressBar(this);
    if (newProps.currentlyPlaying) {
      this.interval = setInterval(() => updateProgressBar(this), 300);
    }
  }

  render() {
    const {
      playingContext,
      currentlyPlaying,
      length,
      queue,
      nextTrack,
      fetchPlayingContext,
      resumePlayback,
      pausePlayback,
      backTrack,
      skipTrack,
    } = this.props;
    const { trackProgress } = this.state;

    return (
      <div className="now-playing-center">
        {playingContext.id
          ? (
            <div className="player-controls">
              <button className="control-button back" onClick={backTrack}>
                <i className="material-icons md-light md-36">skip_previous</i>
              </button>

              <button className="control-button play" onClick={currentlyPlaying ? pausePlayback : resumePlayback}>
                {currentlyPlaying
                  ? <i className="material-icons md-light md-36">pause_circle_outline</i>
                  : <i className="material-icons md-light md-36">play_circle_outline</i>
                }
              </button>

              <button className={`control-button skip ${nextTrack || queue.length > 0 ? null : 'disabled'}`} onClick={skipTrack}>
                <i className="material-icons md-light md-36">skip_next</i>
              </button>
            </div>
          ) : (
            <div className="player-controls">
              <button className="control-button back disabled">
                <i className="material-icons md-light md-36">skip_previous</i>
              </button>

              <button className="control-button play disabled">
                <i className="material-icons md-light md-36">play_circle_outline</i>
              </button>

              <button className="control-button skip disabled">
                <i className="material-icons md-light md-36">skip_next</i>
              </button>
            </div>
          )
        }
        <div className="progress-bar-container">
          <button className="btn-clear md-18 resync" onClick={fetchPlayingContext}>
            <i className="material-icons md-light md-18">sync</i>
          </button>
          <div className="progress-time">{parseMs(trackProgress)}</div>
          <div className={`progress-bar-clickable ${playingContext.id ? null : 'disabled'}`}>
            <div className="progress-bar">
              <div className="progress-bar-progress" />
              <div className="progress-bar-slider" />
            </div>
          </div>
          <div className="progress-time">{parseMs(length)}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  playingContext: state.playingContext,
  currentlyPlaying: state.playingContext.currentlyPlaying,
  length: state.playingContext.length,
  queue: state.view.queue,
  nextTrack: state.view.playHistory.next,
});

const mapDispatchToProps = dispatch => ({
  fetchPlayingContext: () => dispatch(fetchPlayingContext()),
  resumePlayback: () => dispatch(resumePlayback()),
  pausePlayback: () => dispatch(pausePlayback()),
  backTrack: () => dispatch(backTrack()),
  skipTrack: () => dispatch(skipTrack()),
});

export default connect(mapStateToProps, mapDispatchToProps)(NowPlayingCenter);
