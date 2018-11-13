import React, { Component } from 'react';
import { connect } from 'react-redux';
import Queue from './draggablequeuelist/Queue';
import { removeTrack } from '../../../../actions/queueActions';
import { fetchQueue } from '../../../../actions/viewActions';
import { resumePlayback, pausePlayback } from '../../../../actions/trackActions';

class Home extends Component {
  render() {
    const {
      albumArt,
      name,
      artists,
      user,
      currentlyPlaying,
      removeTrack,
      pausePlayback,
      resumePlayback,
      queue,
    } = this.props;
    return (
      <div className="home-tab">
        <div className="home-header">
          <img id="now-playing-home-album-art" src={albumArt} />
          {name
            ? (
              <div className="flex-vertical">
                <h2 className="now-playing-home-track-name">{name}</h2>
                <div className="now-playing-home-artists">{`By ${artists}` || null}</div>
                <div className="now-playing-home-user">{`Queued by: ${user ? user.username : null}`}</div>
                <button className="home-header-play-button" onClick={currentlyPlaying ? pausePlayback : resumePlayback}>{currentlyPlaying ? 'PAUSE' : 'PLAY'}</button>
              </div>
            )
            : <h2 className="now-playing-home-track-name">No songs currently playing</h2>
          }
        </div>
        <div className="queue">Queue</div>
        <Queue />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  queue: state.view.queue,
  currentlyPlaying: state.playingContext.currentlyPlaying,
  albumArt: state.playingContext.albumArt,
  name: state.playingContext.name,
  artists: state.playingContext.artists,
  length: state.playingContext.length,
  user: state.playingContext.user,
});


const mapDispatchToProps = dispatch => ({
  resumePlayback: () => dispatch(resumePlayback()),
  pausePlayback: () => dispatch(pausePlayback()),
  fetchQueue: () => dispatch(fetchQueue()),
  removeTrack: trackID => dispatch(removeTrack(trackID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
