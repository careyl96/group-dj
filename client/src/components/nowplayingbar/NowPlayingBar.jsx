import React from 'react';
import NowPlayingLeft from './NowPlayingLeft';
import NowPlayingCenter from './NowPlayingCenter';
import NowPlayingRight from './NowPlayingRight';

const NowPlayingBar = () => (
  <div className="now-playing-wrapper">
    <div className="now-playing-container">
      <NowPlayingLeft />
      <NowPlayingCenter />
      <NowPlayingRight />
    </div>
  </div>
);

export default NowPlayingBar;
