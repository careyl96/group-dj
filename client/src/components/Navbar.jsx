import React from 'react';
import { connect } from 'react-redux';
import { updateView } from '../../../actions/viewActions';

const Navbar = props => (
  <div className="navbar sidebar">
    <ul className="navbar-items">
      <li className="navbar-item selected" onClick={e => props.updateView('home', e.target.classList)}>Home</li>
      <li className="navbar-item" onClick={e => props.updateView('recently played', e.target.classList)}>Recently Played</li>
      <li className="navbar-item" onClick={e => props.updateView('most played', e.target.classList)}>Most Played</li>
      <li className="navbar-item" onClick={e => props.updateView('my songs', e.target.classList)}>Songs</li>
    </ul>
  </div>
);

const mapDispatchToProps = dispatch => ({
  updateView: (view, item) => dispatch(updateView(view, item)),
});

export default connect(null, mapDispatchToProps)(Navbar);
