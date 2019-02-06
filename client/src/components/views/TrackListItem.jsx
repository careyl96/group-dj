import React from 'react';
import { connect } from 'react-redux';
import { queueTrack, removeTrack } from '../../../../actions/queueActions';
import { overridePlayingContext, pausePlayback, resumePlayback } from '../../../../actions/playerActions';

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

const TrackListItem = ({ track, playingContext, user, queue, overridePlayingContext, queueTrack, removeTrack, resumePlayback, pausePlayback }) => (
  track.id !== playingContext.id // if this item is not the track that is currently playing
    ? (
      <div className="track-item-container" onDoubleClick={() => overridePlayingContext(track, user)}>
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
          <div className="track-name"> {track.name} </div>
          <div className="track-artist"> {track.artists.map(artist => artist.name).join(', ')} </div>
        </div>
        <div className="track-time">
          <span> {parseMs(track.duration_ms)} </span>
        </div>
      </div>
    ) : ( // if this track list item IS the currently playing track
      <div className="track-item-container selected-track">
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
          <div className="track-name highlighted"> {track.name} </div>
          <div className="track-artist"> {track.artists.map(artist => artist.name).join(', ')} </div>
        </div>
        <div className="track-time highlighted">
          <span> {parseMs(track.duration_ms)} </span>
        </div>
      </div>
    )
);

const mapStateToProps = state => ({
  playingContext: state.playingContext,
  user: state.session.user,
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
