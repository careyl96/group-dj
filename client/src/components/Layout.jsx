import React, { Component } from 'react';
import axios from 'axios';
import NowPlayingBar from './NowPlayingBar';
import Search from './Search';

class Layout extends Component {
  constructor() {
    super();
    this.state = {
      thumbnails: null,
      trackName: null,
      artists: null,
      popularity: null,
      currentlyPlaying: null,
      trackProgress: null,
      view: null,
    };
  }

  componentDidMount() {
    this.getSongData();
  }

  getSongData = () => {
    const { accessToken } = this.props;
    const params = {
      method: 'GET',
      url: 'https://api.spotify.com/v1/me/player/currently-playing/',
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    axios(params)
      .then((response) => {
        const thumbnails = response.data.item.album.images;
        const trackName = response.data.item.name;
        const artists = response.data.item.artists;
        const popularity = response.data.item.popularity;
        const currentlyPlaying = response.data.is_playing;
        const trackLength = response.data.item.duration_ms;
        const trackProgress = response.data.progress_ms;

        console.log('Getting song data');
        // console.log(response);
        this.setState({
          thumbnails,
          trackName,
          artists,
          popularity,
          currentlyPlaying,
          trackLength,
          trackProgress,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  play = () => {
    const { accessToken } = this.props;
    const params = {
      method: 'PUT',
      url: 'https://api.spotify.com/v1/me/player/play',
      // context_uri: 'spotify:album:5ht7ItJgpBH7W6vJ5BqpPr',
      // offset: { position: 15 },
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    // const songData = Object.assign({}, this.state);
    // songData.currentlyPlaying = true;

    axios(params)
      .then((response) => {
        this.setState({ currentlyPlaying: true });
        console.log('Playing song');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  pause = () => {
    const { accessToken } = this.props;
    const params = {
      method: 'PUT',
      url: 'https://api.spotify.com/v1/me/player/pause',
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    // const songData = Object.assign({}, this.state);
    // songData.currentlyPlaying = false;
    // console.log(songData);
    axios(params)
      .then((response) => {
        this.setState({ currentlyPlaying: false });
        console.log('Pausing song');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  seek = () => {
    const { accessToken } = this.props;
    const params = {
      method: 'PUT',
      url: 'https://api.spotify.com/v1/me/player/seek',
      params: { position_ms: '26000' },
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    axios(params)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  renderNowPlayingBar() {
    const { currentlyPlaying, thumbnails, trackName, artists, trackLength, trackProgress } = this.state;
    if (artists) {
      return (
        <NowPlayingBar
          play={this.play}
          pause={this.pause}
          seek={this.seek}
          getSongData={this.getSongData}
          currentlyPlaying={currentlyPlaying}
          thumbnails={thumbnails}
          trackName={trackName}
          artists={artists}
          trackLength={trackLength}
          trackProgress={trackProgress}
        />
      );
    }
    return null;
  }

  render() {
    return (
      <div className="layout">
        <button onClick={this.getSongData}>GET SONG DATA</button>
        <Search accessToken={this.props.accessToken} />
        {/* <Navbar /> */}
        {/* <SideBar /> */}
        {/* <MusicHistory /> */}
        {/* <Queue /> */}
        {this.renderNowPlayingBar()}
      </div>
    );
  }
}

export default Layout;
