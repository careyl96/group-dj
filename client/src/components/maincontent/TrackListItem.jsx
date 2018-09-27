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

const TrackListItem = ({ track, name, artists, duration, playingContext, user, queue, overridePlayingContext, queueTrack, removeTrack, resumePlayback, pausePlayback }) => (
  track.id !== playingContext.id // if this item is not the track that is currently playing
    ? (
      <div className="track-container">
        <button className="btn-tracklist-item" onClick={() => overridePlayingContext(track, user)}>
          <i className="material-icons md-light md-36 btn-play">play_circle_outline</i>
        </button>

        {queue.find(item => item.track.id === track.id)
          ? (
            <button className="btn-tracklist-item" onClick={() => removeTrack(track.id)}>
              <i className="material-icons md-light md-36 check">check</i>
              <i className="material-icons md-light md-36 clear">clear</i>
            </button>
          ) : (
            <button className="btn-tracklist-item" onClick={() => queueTrack(track, user)}>
              <i className="material-icons md-light md-36 btn-queue">playlist_add</i>
            </button>
          )}
        <div className="track-info tracklist-item">
          <div className="track-name"> {name} </div>
          <div className="track-artist"> {artists} </div>
        </div>
        <div className="track-time">
          <span> {parseMs(duration)} </span>
        </div>
      </div>
    ) : ( // if this track list item is the currently playing track
      <div className="track-container selected-track">
        <button className="btn-tracklist-item" onClick={playingContext.currentlyPlaying ? pausePlayback : resumePlayback}>
          {playingContext.currentlyPlaying
            ? <i className="material-icons md-light md-36 btn-play selected-track">pause_circle_outline</i>
            : <i className="material-icons md-light md-36 btn-play">play_circle_outline</i>
          }
        </button>
        {queue.find(item => item.track.id === track.id)
          ? (
            <button className="btn-tracklist-item" onClick={() => removeTrack(track.id)}>
              <i className="material-icons md-light md-36 check">check</i>
              <i className="material-icons md-light md-36 clear">clear</i>
            </button>
          ) : (
            <button className="btn-tracklist-item" onClick={() => queueTrack(track, user)}>
              <i className="material-icons md-light md-36 btn-queue">playlist_add</i>
            </button>
          )
        }
        <div className="track-info tracklist-item">
          <div className="track-name highlighted"> {name} </div>
          <div className="track-artist"> {artists} </div>
        </div>
        <div className="track-time highlighted">
          <span> {parseMs(duration)} </span>
        </div>
      </div>
    )
);

const mapStateToProps = state => ({
  playingContext: state.playingContext,
  user: {
    username: state.session.username,
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
