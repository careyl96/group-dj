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

const QueueItem = ({ track, name, artists, duration, removeTrack, user }) => (
  <div className="track-container">
    <button className="btn-tracklist-item" onClick={() => removeTrack(track.id)}>
      <i className="material-icons md-light md-36 remove-track">close</i>
    </button>
    <div className="track-info tracklist-item">
      <div className="track-name"> {name} </div>
      <div className="track-artist"> {artists} </div>
    </div>
    <div className="track-time">
      <span> {parseMs(duration)} </span>
      <span> {console.log(user)} </span>
    </div>
  </div>
);

export default QueueItem;
