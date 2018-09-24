import React, { Component } from 'react';
import { connect } from 'react-redux';
import { queueTrack, removeTrack } from '../../../../actions/queueActions';
import { overridePlayingContext, pausePlayback, resumePlayback } from '../../../../actions/trackActions';

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

class TrackListItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.track.id !== this.props.playingContext.id) { //if this item is a regular queue item
      return (
        <div className="track-container">
          <button className="btn-tracklist-item" onClick={() => this.props.overridePlayingContext(this.props.track, this.props.user)} >
            <i className="material-icons md-light md-36 btn-play">play_circle_outline</i>
          </button>

          {this.props.queue.find(item => item.track.id === this.props.track.id)
            ?
            <button className="btn-tracklist-item" onClick={() => this.props.removeTrack(this.props.track.id)}>
              <i className="material-icons md-light md-36 check">check</i>
              <i className="material-icons md-light md-36 clear">clear</i>
            </button>
            :
            <button className="btn-tracklist-item" onClick={() => this.props.queueTrack(this.props.track, this.props.user)}>
              <i className="material-icons md-light md-36 btn-queue">playlist_add</i>
            </button>
          }
          <div className="track-info tracklist-item">
            <div className="track-name"> {this.props.name} </div>
            <div className="track-artist"> {this.props.artists} </div>
          </div>
          <div className="track-time">
            <span> {parseMs(this.props.duration)} </span>
          </div>
        </div >
      )
    } else { //if this item is playing right now
      return (
        <div className="track-container selected-track">
          <button className="btn-tracklist-item" onClick={this.props.playingContext.currentlyPlaying ? this.props.pausePlayback : this.props.resumePlayback}>
            {this.props.playingContext.currentlyPlaying
              ? <i className="material-icons md-light md-36 btn-play selected-track">pause_circle_outline</i>
              : <i className="material-icons md-light md-36 btn-play">play_circle_outline</i>
            }
          </button>
          {this.props.queue.find(item => item.track.id === this.props.track.id)
            ?
            <button className="btn-tracklist-item" onClick={() => this.props.removeTrack(this.props.track.id)}>
              <i className="material-icons md-light md-36 check">check</i>
              <i className="material-icons md-light md-36 clear">clear</i>
            </button>
            :
            <button className="btn-tracklist-item" onClick={() => this.props.queueTrack(this.props.track, this.props.user)}>
              <i className="material-icons md-light md-36 btn-queue">playlist_add</i>
            </button>
          }
          <div className="track-info tracklist-item">
            <div className="track-name highlighted"> {this.props.name} </div>
            <div className="track-artist"> {this.props.artists} </div>
          </div>
          <div className="track-time highlighted">
            <span> {parseMs(this.props.duration)} </span>
          </div>
        </div>
      )
    };
  }
}

const mapStateToProps = state => ({
  playingContext: state.playingContext,
  user: {
    username: state.session.user,
    id: state.session.id,
  },
  queue: state.view.queue,
});

const mapDispatchToProps = dispatch => ({
  overridePlayingContext: (track, user) => dispatch(overridePlayingContext(track, user)),
  queueTrack: (track, user) => dispatch(queueTrack(track, user)),
  removeTrack: trackID => dispatch(removeTrack(trackID)),
  resumePlayback: () => dispatch(resumePlayback()),
  pausePlayback: () => dispatch(pausePlayback()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TrackListItem);
