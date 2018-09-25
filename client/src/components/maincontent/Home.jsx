import React, { Component } from 'react';
import { connect } from 'react-redux';
import QueueItem from './QueueItem';
import { removeTrack } from '../../../../actions/queueActions';
import { fetchQueue } from '../../../../actions/viewActions';
import { resumePlayback, pausePlayback } from '../../../../actions/trackActions';

class Home extends Component {
  render() {
    const { isTrackPlaying, queue } = this.props;
    return (
      <div className="home-tab">
        <div className="home-header">
          <img id="now-playing-home-album-art" src={this.props.albumArt} />
          {isTrackPlaying ?
            <div className="flex-vertical">
              <h2 className="now-playing-home-track-name">{this.props.name}</h2>
              <div className="now-playing-home-artists">{`By ${this.props.artists}` || null}</div>
              <div className="now-playing-home-user">{`Queued by: ${this.props.user ? this.props.user.username : null}`}</div>
              <button className="home-header-play-button" onClick={this.props.currentlyPlaying ? this.props.pausePlayback : this.props.resumePlayback}>{this.props.currentlyPlaying ? 'PAUSE' : 'PLAY'}</button>
            </div>
            :
            <h2 className="now-playing-home-track-name">No songs currently playing</h2>
          }
        </div>
        <div className="queue">Queue</div>
        {queue.length > 0
          ?
          queue.map((queueItem, index) => (
            <QueueItem
              key={index}
              track={queueItem.track}
              name={queueItem.track.name}
              artists={queueItem.track.artists.map(artist => artist.name).join(', ')}
              duration={queueItem.track.duration_ms}
              removeTrack={this.props.removeTrack}
            // queueItem.track.user = id of user who queued the song
            />
          ))
          :
          <h2 className="queue-empty-container">
            <span>The queue is empty!</span>
            <span>Use the search bar to search for songs</span>
          </h2>
          }
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
  isTrackPlaying: state.playingContext.name !== null,
});


const mapDispatchToProps = dispatch => ({
  resumePlayback: () => dispatch(resumePlayback()),
  pausePlayback: () => dispatch(pausePlayback()),
  fetchQueue: () => dispatch(fetchQueue()),
  removeTrack: trackID => dispatch(removeTrack(trackID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
