import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateView } from '../../../actions/viewActions';

class Navbar extends Component {
  render() {
    const handleClick = (view, e) => {
      if (e.target.classList.contains('selected')) return;
      this.props.updateView(view);
      const navBarItems = Array.from(document.querySelectorAll('.navbar-item'));
      navBarItems.forEach(item => {
        if (item.classList.contains('selected')) {
          item.classList.remove('selected');
        }
      });
      e.target.classList.add('selected');
    }
    return (
      <div className="navbar sidebar">
        <ul className="navbar-items">
          {/* <button onClick={this.this.props.fetchTrack}>GET SONG DATA</button> */}
          <li className="navbar-item selected" onClick={(e) => handleClick('home', e)}>
            Home
          </li>
          <li className="navbar-item" onClick={(e) => handleClick('recently played', e)}>
            Recently Played
          </li>
          <li className="navbar-item" onClick={(e) => handleClick('most played', e)}>
            Most Played
          </li>
          <li className="navbar-item" onClick={(e) => handleClick('my songs', e)}>
            Songs
          </li>
        </ul>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  updateView: view => dispatch(updateView(view)),
});

export default connect(null, mapDispatchToProps)(Navbar);
