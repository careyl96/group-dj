import React from 'react';
import { connect } from 'react-redux';
import { SortableElement } from 'react-sortable-hoc';
import { removeTrack } from '../../../../../actions/queueActions';

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

const QueueItem = SortableElement(({ track, name, artists, duration, removeTrack, user }) => (
  <li className="track-container">
    <button className="btn-tracklist-item" onClick={() => removeTrack(track.id)}>
      <i className="material-icons md-light md-36 remove-track">close</i>
    </button>
    <div className="track-info tracklist-item">
      <span className="track-name"> {name} </span>
      <span className="track-artist"> {artists} </span>
    </div>
    <div className="queued-by">
      <i className="material-icons md-light md-24 icon-queued-by">queue</i>
      <span className="queued-by-name">{`Queued by ${user.username}`}</span>
    </div>
    <div className="track-time">
      <span> {parseMs(duration)} </span>
    </div>
  </li>
));

const mapDispatchToProps = dispatch => ({
  removeTrack: trackID => dispatch(removeTrack(trackID)),
});

export default connect(null, mapDispatchToProps)(QueueItem);
