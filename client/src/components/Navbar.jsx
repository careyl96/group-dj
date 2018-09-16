import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchTrack } from '../../../actions/trackActions';
import { updateView } from '../../../actions/sessionActions';

class Navbar extends Component {
  render() {
    return (
      <div className="navbar sidebar">
        <ul className="navbar-items">
          {/* <button onClick={this.props.fetchTrack}>GET SONG DATA</button> */}
          <li className="navbar-item" onClick={() => this.props.updateView('home')}><div className="home-nav nav-button">Home</div></li>
          <li className="navbar-item" onClick={() => this.props.updateView('recently played')}><div className="recently-played nav-button">Recently Played</div></li>
          <li className="navbar-item" onClick={() => this.props.updateView('most played')}><div className="most-played nav-button">Most Played</div></li>
          <li className="navbar-item" onClick={() => this.props.updateView('my songs')}><div className="your-songs nav-button">Songs</div></li>
        </ul>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fetchTrackData: () => dispatch(fetchTrackData()),
  updateView: view => dispatch(updateView(view)),
});

export default connect(null, mapDispatchToProps)(Navbar);
