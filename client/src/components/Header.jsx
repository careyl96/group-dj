import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchTrackData } from '../../../actions/trackActions';

class Header extends Component {
  render() {
    return (
      <div className="header">
        <button onClick={this.props.fetchTrackData}>GET SONG DATA</button>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fetchTrackData: () => dispatch(fetchTrackData()),
});

export default connect(null, mapDispatchToProps)(Header);
