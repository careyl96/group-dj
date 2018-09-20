import React, { Component } from 'react';
import { connect } from 'react-redux';
import TrackListItem from './TrackListItem';
import { overridePlayingContext } from '../../../../actions/trackActions';

class RecentlyPlayed extends Component {
  render() {
    const { recentlyPlayed } = this.props;
    return (
      <div className="recently-played-tab">
        <div className="main-header">Recently Played</div>
        {recentlyPlayed
          ?
          recentlyPlayed.map(recentlyPlayed => (
            <TrackListItem
              key={recentlyPlayed.track.uri}
              track={recentlyPlayed.track}
              name={recentlyPlayed.track.name}
              artists={recentlyPlayed.track.artists.map(artist => artist.name).join(', ')}
              duration={recentlyPlayed.track.duration_ms}
              overridePlayingContext={this.props.overridePlayingContext}
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
