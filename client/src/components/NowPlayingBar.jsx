import React from 'react';
import NowPlayingLeft from './nowplayingbar/NowPlayingLeft';
import NowPlayingCenter from './nowplayingbar/NowPlayingCenter';
import NowPlayingRight from './nowplayingbar/NowPlayingRight';

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
