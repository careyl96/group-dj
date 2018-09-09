import React, { Component } from 'react';
import { connect } from 'react-redux';
import Queue from './Queue';
import Header from './Header';
import Users from './Users';
import NowPlayingBar from './NowPlayingBar';

class Layout extends Component {
  render() {
    return (
      <div className="layout">
        {/* <Header /> */}
        <Users />
        <Queue />
        {/* <Navbar /> */}
        {/* <SideBar /> */}
        {/* <MusicHistory /> */}
        {/* <Queue /> */}
        <NowPlayingBar />
      </div>
    );
  }
}

export default Layout;
