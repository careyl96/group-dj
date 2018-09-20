import React from 'react';

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

const QueueItem = ({ track, name, artists, duration, removeTrack }) => (
  <div className="track-container">
    <button className="track-list-item-control btn-remove-track" onClick={() => removeTrack(track.id)}>
      <i className="material-icons md-light md-24">close</i>
    </button>
    <div className="track-info track-list-item">
      <div className="track-name"> {name} </div>
      <div className="track-artist"> {artists} </div>
    </div>
    <div className="track-time">
      <span> {parseMs(duration)} </span>
    </div>
  </div>
);

export default QueueItem;
