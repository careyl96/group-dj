import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import addEventListeners from './event-listeners/now-playing-bar-events';
import {
  fetchTrackData,
  resumePlayback,
  pausePlayback,
  seekTrack,
  skipTrack,
} from '../../../actions/trackActions';

const Footer = styled.div`
  position: fixed;
  background-color: #282828;
  width: 100%;
  border-top: 1px solid black;
  bottom: 0;
`;

const NowPlayingRight = styled.div`
  border: 1px solid white;
  min-width: 180px;
  width: 30%;
`;

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
      trackLength: 0,
      progressPercentage: 0,
    };

    this.interval = null;
  }

  componentDidMount() {
    this.props.fetchTrackData();
    addEventListeners(this);
  }

  componentWillReceiveProps(newProps) {
    const { trackProgress, trackLength } = newProps;
    const progressPercentage = trackProgress / trackLength * 100;
    this.setState({
      trackProgress,
      trackLength,
      progressPercentage,
    });
    if (!this.interval) this.interval = setInterval(this.updateProgressBar, 300);
  }

  updateProgressBar = () => {
    const progressBar = document.querySelector('.progress-bar-progress');
    const progressBarSlider = document.querySelector('.progress-bar-slider');

    const { trackProgress, trackLength, progressPercentage } = this.state;

    if (progressPercentage <= 100) {
      progressBar.style.width = (`${progressPercentage}%`);
      progressBarSlider.style.left = (`${progressPercentage}%`);

      if (this.props.currentlyPlaying) {
        const incrementedTrackProgress = trackProgress + 300;
        const newTrackPercentage = incrementedTrackProgress / trackLength * 100;

        this.setState({
          trackProgress: incrementedTrackProgress,
          trackLength,
          progressPercentage: newTrackPercentage,
        });
      }
    } else {
      this.props.fetchTrackData();
      console.log('fetching data');
    }
  }

  // 

  render() {
    return (
      <Footer>
        <div className="now-playing-container">

          {/* NOW PLAYING BAR LEFT SIDE - ALBUM ART/TRACK INFO */}
          <div className="now-playing-left">
            <div className="album-art-container">
              <img id="album-art-thumbnail" src={this.props.albumArt} />
            </div>
            <div className="track-info">
              <div className="track-name"> {this.props.trackName} </div>
              <div className="track-artist"> {this.props.artists} </div>
            </div>
            <button className="control-button add-song">+</button>
          </div>

          {/* NOW PLAYING CENTER - PLAYER CONTROLS AND PROGRESS BAR */}
          <div className="now-playing-center">
            <div className="player-controls">
              <button className="control-button shuffle">shfl</button>
              <button className="control-button back">back</button>
              <button className="control-button play" onClick={this.props.currentlyPlaying ? this.props.pausePlayback : this.props.resumePlayback}>{this.props.currentlyPlaying ? 'pause' : 'play'}</button>
              <button className="control-button skip" onClick={this.props.skipTrack}>next</button>
              <button className="control-button loop">loop</button>
            </div>
            <div className="progress-bar-container">
              <div className="progress-time">{parseMs(this.state.trackProgress)}</div>
              <div className="progress-bar-clickable" onClick={this.handleClick}>
                <div className="progress-bar">
                  <div className="progress-bar-progress" />
                  <div className="progress-bar-slider" />
                </div>
              </div>
              <div className="progress-time">{parseMs(this.state.trackLength)}</div>
            </div>
          </div>

          <NowPlayingRight>Right
            <div className="state-tracker">{this.state.trackProgress}</div>
          </NowPlayingRight>
        </div>
      </Footer>
    );
  }
}

const mapStateToProps = state => ({
  currentlyPlaying: state.trackData.currentlyPlaying,
  trackName: state.trackData.trackName,
  artists: state.trackData.artists,
  trackLength: state.trackData.trackLength,
  trackProgress: state.trackData.trackProgress,
  albumArt: state.trackData.albumArt,
  popularity: state.trackData.popularity,
});
const mapDispatchToProps = dispatch => ({
  fetchTrackData: () => dispatch(fetchTrackData()),
  resumePlayback: () => dispatch(resumePlayback()),
  pausePlayback: () => dispatch(pausePlayback()),
  seekTrack: newTrackPosition => dispatch(seekTrack(newTrackPosition)),
  skipTrack: () => dispatch(skipTrack()),
  incrementTrackProgress: newTrackProgress => dispatch(incrementTrackProgress(newTrackProgress)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NowPlayingBar);
