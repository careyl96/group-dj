import React, { Component } from 'react';
import styled from 'styled-components';

const Footer = styled.footer`
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

const parseArtists = (artists) => {
  const artistList = [];
  artists.forEach(artist => artistList.push(artist.name));
  return artistList.join(', ');
};

const parseMs = (ms) => {
  let result = '';
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  while (ms > 3600000) {
    hours += 1;
    ms -= 3600000;
  }

  while (ms > 60000) {
    minutes += 1;
    ms -= 60000;
  }

  while (ms > 1000) {
    seconds += 1;
    ms -= 1000
  }

  if (seconds < 10) {
    seconds = `0${seconds}`
  }

  if (hours) {
    result += `${hours}:${minutes}:${seconds}`;
  } else {
    result += `${minutes}:${seconds}`;
  }

  return result;
};

class NowPlayingBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trackProgress: this.props.trackProgress,
    };

    this.interval = setInterval(this.updateProgress, 300);
  }

  componentWillReceiveProps(newProps) {
    const { trackProgress } = newProps;
    this.setState({ trackProgress });
  }

  updateProgress = () => {
    const { currentlyPlaying } = this.props;  
    if (currentlyPlaying) {
      const progressBar = document.querySelector('.progress-bar-progress');
      const { trackProgress } = this.state;
      const { trackLength } = this.props;

      const progressPercentage = trackProgress / trackLength * 100;
      if (progressPercentage >= 100) {
        this.props.getSongData();
      }
      this.setState({ trackProgress: trackProgress + 300 });
      progressBar.style.width = (`${progressPercentage}%`);
    }
  };

  render() {
    return (
      <Footer>
        <div className="now-playing-container">

          {/* NOW PLAYING BAR LEFT SIDE - ALBUM ART/TRACK INFO */}
          <div className="now-playing-left">
            <div className="album-art-container">
              <img id="album-art-thumbnail" src={this.props.thumbnails[2].url} />
            </div>
            <div className="track-info">
              <div className="track-name"> {this.props.trackName} </div>
              <div className="track-artist"> {parseArtists(this.props.artists)} </div>
            </div>
          </div>

          {/* NOW PLAYING CENTER - PLAYER CONTROLS AND PROGRESS BAR */}
          <div className="now-playing-center">
            <div className="player-controls">
              <button className="control-button shuffle">shfl</button>
              <button className="control-button back">back</button>
              <button className="control-button play" onClick={this.props.currentlyPlaying ? this.props.pause : this.props.play}>{this.props.currentlyPlaying ? 'Pause' : 'Play'}</button>
              <button className="control-button skip">next</button>
              <button className="control-button loop">loop</button>
            </div>
            <div className="progress-bar-container">
              <div className="progress-time">{parseMs(this.state.trackProgress)}</div>
              <div className="progress-bar">
                <div className="progress-bar-progress" />
              </div>
              <div className="progress-time">{parseMs(this.props.trackLength)}</div>
            </div>
          </div>

          <NowPlayingRight>Right
  
  
          </NowPlayingRight>
        </div>
      </Footer>
    );
  }
}

export default NowPlayingBar;
