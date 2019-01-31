import React, { Component } from 'react';
import { connect } from 'react-redux';
import TrackListItem from './TrackListItem';
import { overridePlayingContext } from '../../../../actions/playerActions';

class RecentlyPlayed extends Component {
  render() {
    const { recentlyPlayed } = this.props;
    return (
      <div className="recently-played-tab">
        <div className="view-header">Recently Played</div>
        {recentlyPlayed
          ?
          recentlyPlayed.map(recentlyPlayedResult => (
            <TrackListItem
              key={recentlyPlayedResult.track.uri}
              track={recentlyPlayedResult.track}
            />
          ))
          : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  recentlyPlayed: state.view.recentlyPlayed,
});

const mapDispatchToProps = dispatch => ({
  overridePlayingContext: track => dispatch(overridePlayingContext(track)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecentlyPlayed);
