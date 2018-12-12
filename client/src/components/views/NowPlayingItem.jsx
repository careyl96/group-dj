import React from 'react';
import { connect } from 'react-redux';

const NowPlayingItem = ({ albumArt }) => (
  <div className="now-playing-item-container">
    <div className="now-playing-item-album-art-container">
      <img id="album-art-thumbnail" alt="album-art-thumbnail" src={albumArt} />
    </div>
  </div>
);

const mapStateToProps = state => ({
  albumArt: state.playingContext.albumArt,
});

export default connect(mapStateToProps, null)(NowPlayingItem);
