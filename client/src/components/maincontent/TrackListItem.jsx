import React from 'react';

const TrackListItem = ({ track, name, artists, duration, overridePlayingContext }) => {
  return (
    <div className="track-container">
      <button className="control-button" onClick={() => overridePlayingContext(track)}>Play</button>
      <div className="track-info result">
        <div className="track-name"> {name} </div>
        <div className="track-artist"> {artists} </div>
      </div>
      <div className="track-time">
        <span> {duration} </span>
      </div>
    </div>
  );
};

export default TrackListItem;
