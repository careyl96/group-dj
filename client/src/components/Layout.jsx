import React, { Component } from 'react';
import ViewHandler from './ViewHandler';
import Navbar from './Navbar';
import Users from './Users';
import NowPlayingBar from './nowplayingbar/NowPlayingBar';

class Layout extends Component {
  render() {
    return (
      <div className="layout">
        {/* <Header /> */}
        <Navbar />
        <Users />
        <ViewHandler />
        <NowPlayingBar />
      </div>
    );
  }
}

export default Layout;
