import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateView } from '../../../actions/viewActions';

const Navbar = props => (
  <div className="navbar sidebar">
    <ul className="navbar-items">
      {/* <button onClick={this.props.fetchTrack}>GET SONG DATA</button> */}
      <li className="navbar-item" onClick={() => props.updateView('home')}><div className="home-nav nav-button">Home</div></li>
      <li className="navbar-item" onClick={() => props.updateView('recently played')}><div className="recently-played nav-button">Recently Played</div></li>
      <li className="navbar-item" onClick={() => props.updateView('most played')}><div className="most-played nav-button">Most Played</div></li>
      <li className="navbar-item" onClick={() => props.updateView('my songs')}><div className="your-songs nav-button">Songs</div></li>
    </ul>
  </div>
);


const mapDispatchToProps = dispatch => ({
  updateView: view => dispatch(updateView(view)),
});

export default connect(null, mapDispatchToProps)(Navbar);
