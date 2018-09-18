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

const TrackListItem = ({ track, name, artists, duration, overridePlayingContext }) => (
  <div className="track-container">
    <button className="control-button" onClick={() => overridePlayingContext(track)}>Play</button>
    <div className="track-info track-list-item">
      <div className="track-name"> {name} </div>
      <div className="track-artist"> {artists} </div>
    </div>
    <div className="track-time">
      <span> {parseMs(duration)} </span>
    </div>
  </div>
);

export default TrackListItem;
