import React, { Component } from 'react';

class NowPlayingItem extends Component {
  render() {
    return (
      <div className="now-playing-item-container">
        <div className="now-playing-item-album-art-container">
          <img id="album-art-thumbnail" src="https://i.scdn.co/image/1b67f48284538f23ff5a9a96cf3296e6d4fb7606" />
        </div>
      </div>
    );
  }
}

export default NowPlayingItem;
