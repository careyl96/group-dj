import React from 'react';
import { connect } from 'react-redux';
import { updateView } from '../../../actions/viewActions';

const Navbar = props => (
  <div className="navbar sidebar">
    <ul className="navbar-items">
      <li className="navbar-item home-nav selected" onClick={e => props.updateView('home', e.target)}>Home</li>
      <li className="navbar-item recently-played-nav" onClick={e => props.updateView('recently played', e.target)}>Recently Played</li>
      <li className="navbar-item most-played-nav" onClick={e => props.updateView('most played', e.target)}>Most Played</li>
      <li className="navbar-item my-songs-nav" onClick={e => props.updateView('my songs', e.target)}>Songs</li>
    </ul>
  </div>
);

const mapDispatchToProps = dispatch => ({
  updateView: (view, item) => dispatch(updateView(view, item)),
});

export default connect(null, mapDispatchToProps)(Navbar);
