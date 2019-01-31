import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addNowPlayingCenterEventListeners } from '../event-listeners/now-playing-bar-events';
import {
  fetchPlayingContext,
  resumePlayback,
  pausePlayback,
  skipTrack,
  backTrack,
} from '../../../../actions/playerActions';

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
  constructor(props) {
    super(props);
    this.state = {
      trackProgress: 0,
      mouseDown: false,
    };

    this.interval = null;

    this.updateProgressBar = () => {
      const progressBarProgress = document.querySelector('.progress-bar-progress');
      const progressBarSlider = document.querySelector('.progress-bar-slider');

      const { playingContext } = this.props;
      const { length, currentlyPlaying, fetching } = playingContext;
      let { trackProgress } = this.state;
      const { mouseDown } = this.state;

      let progressPercentage = 0;

      if (currentlyPlaying) {
        progressPercentage = trackProgress / length * 100;
        if (progressPercentage < 100 && !mouseDown && !fetching) {
          progressBarProgress.style.width = (`${progressPercentage}%`);
          progressBarSlider.style.left = (`${progressPercentage}%`);
          trackProgress = length * progressPercentage / 100;
          this.setState({ trackProgress: trackProgress + 300 });
        } else if (progressPercentage >= 100 && !mouseDown) {
          progressBarProgress.style.width = ('0%');
          progressBarSlider.style.left = ('0%');
          this.setState({ trackProgress: 0 });
        }
      } else { // necessary to properly render progress bar on initial page load
        progressPercentage = trackProgress / length * 100;
        progressBarProgress.style.width = (`${progressPercentage}%`);
        progressBarSlider.style.left = (`${progressPercentage}%`);
      }
    };
  }

  componentDidMount() {
    this.interval = setInterval(this.updateProgressBar, 300);
    addNowPlayingCenterEventListeners(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({ trackProgress: newProps.playingContext.trackProgress || 0 });
  }

  render() {
    const {
      playingContext,
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
              <button className="control-btn back" onClick={backTrack}>
                <i className="material-icons md-light md-36">skip_previous</i>
              </button>

              <button className="control-btn play" onClick={playingContext.currentlyPlaying ? pausePlayback : resumePlayback}>
                {playingContext.currentlyPlaying
                  ? <i className="material-icons md-light md-36">pause_circle_outline</i>
                  : <i className="material-icons md-light md-36">play_circle_outline</i>
                }
              </button>

              <button className={`control-btn skip ${nextTrack || queue.length > 0 ? null : 'disabled'}`} onClick={skipTrack}>
                <i className="material-icons md-light md-36">skip_next</i>
              </button>
            </div>
          ) : (
            <div className="player-controls">
              <button className="control-btn back disabled">
                <i className="material-icons md-light md-36">skip_previous</i>
              </button>

              <button className="control-btn play disabled">
                <i className="material-icons md-light md-36">play_circle_outline</i>
              </button>

              <button className="control-btn skip disabled">
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
          <div className="progress-time">{parseMs(playingContext.length)}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  playingContext: state.playingContext,
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
