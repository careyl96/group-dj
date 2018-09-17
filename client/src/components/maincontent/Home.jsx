import React, { Component } from 'react';
import { connect } from 'react-redux';
import TrackListItem from './TrackListItem';
import { overridePlayingContext } from '../../../../actions/trackActions';
import { fetchQueue } from '../../../../actions/viewActions';

class Home extends Component {
  render() {
    const { queue } = this.props;
    return (
      <div className="home-tab">
        <div className="main-header">Queue</div>
        {queue
          ? queue.map(queueItem => (
            <TrackListItem
              key={queueItem.uri}
              track={queueItem}
              name={queueItem.name}
              artists={queueItem.artists.map(artist => artist.name).join(', ')}
              duration={queueItem.duration_ms}
              overridePlayingContext={this.props.overridePlayingContext}
            />
          ))
          : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  queue: state.view.queue,
});

const mapDispatchToProps = dispatch => ({
  fetchQueue: () => dispatch(fetchQueue()),
  overridePlayingContext: track => dispatch(overridePlayingContext(track)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
