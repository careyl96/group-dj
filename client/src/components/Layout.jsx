import React, { Component } from 'react';
import { connect } from 'react-redux';
import NowPlayingBar from './NowPlayingBar';
import Search from './Search';
import { fetchTrackData } from '../../../actions/trackActions';

class Layout extends Component {
  render() {
    return (
      <div className="layout">
        <button onClick={this.props.fetchTrackData}>GET SONG DATA</button>
        <Search />
        {/* <Navbar /> */}
        {/* <SideBar /> */}
        {/* <MusicHistory /> */}
        {/* <Queue /> */}
        <NowPlayingBar />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fetchTrackData: () => dispatch(fetchTrackData()),
});

export default connect(null, mapDispatchToProps)(Layout);
