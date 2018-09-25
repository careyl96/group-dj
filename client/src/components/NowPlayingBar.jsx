import React from 'react';
import NowPlayingLeft from './nowplayingcontent/NowPlayingLeft';
import NowPlayingCenter from './nowplayingcontent/NowPlayingCenter';
import NowPlayingRight from './nowplayingcontent/NowPlayingRight';

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
