import React, { Component } from 'react';
import { connect } from 'react-redux';
import Main from './Main';
import Navbar from './Navbar';
import Users from './Users';
import NowPlayingBar from './NowPlayingBar';

class Layout extends Component {
  render() {
    return (
      <div className="layout">
        {/* <Header /> */}
        <Navbar />
        <Users />
        <Main />
        <NowPlayingBar />
      </div>
    );
  }
}

export default Layout;
