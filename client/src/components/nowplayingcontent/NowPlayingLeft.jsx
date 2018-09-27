import React from 'react';
import { connect } from 'react-redux';

const NowPlayingLeft = ({ name, artists, albumArt }) => (
  <div className="now-playing-left">
    <div className="album-art-container">
      <img id="album-art-thumbnail" alt="albumArt" src={albumArt} />
    </div>
    <div className="track-info">
      <div className="track-name"> {name} </div>
      <div className="track-artist"> {artists} </div>
    </div>
    <button className={`control-button add-song ${name ? null : 'disabled'}`} style={{ display: 'none' }}>
      <i className="material-icons md-light md-24">add</i>
    </button>
  </div>
);

const mapStateToProps = state => ({
  name: state.playingContext.name,
  artists: state.playingContext.artists,
  albumArt: state.playingContext.albumArt,
});

export default connect(mapStateToProps, null)(NowPlayingLeft);
