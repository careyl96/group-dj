import React, { Component } from 'react';
import TrackListItem from './TrackListItem';
import NowPlayingItem from './NowPlayingItem';

class Home extends Component {
  render() {
    return (
      <div className="home-tab">
        {/* <div className="main-header">Now Playing</div> */}
        {/* <NowPlayingItem /> */}
        <div className="main-header">Queue</div>
      </div>
    );
  }
}

export default Home;
