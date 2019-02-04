import React, { Component } from 'react';
import { connect } from 'react-redux';
import TrackListItem from './TrackListItem';
import { fetchMySongs } from '../../../../actions/viewActions';

class MySongs extends Component {
  componentDidMount() {
    const { fetchMySongs } = this.props;
    fetchMySongs();
  }

  render() {
    const { mySongs } = this.props;
    return (
      <div className="my-songs-tab">
        <div className="view-header">My Songs</div>
        {mySongs
          ? mySongs.map(mySongsResult => (
            <TrackListItem
              key={mySongsResult.track.uri}
              track={mySongsResult.track}
            />
          ))
          : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  mySongs: state.view.mySongs,
});

const mapDispatchToProps = dispatch => ({
  fetchMySongs: () => dispatch(fetchMySongs()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MySongs);
