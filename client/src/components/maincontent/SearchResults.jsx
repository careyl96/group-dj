import React, { Component } from 'react';
import { connect } from 'react-redux';
import TrackListItem from './TrackListItem';
import { overridePlayingContext } from '../../../../actions/trackActions';
import { queueTrack } from '../../../../actions/queueActions';

class SearchResults extends Component {
  render() {
    const { results } = this.props;
    return (
      <div className="home-tab">
        <div className="main-header">Results</div>
        {results
          ? results.map(searchResult => (
            <TrackListItem
              key={searchResult.uri}
              track={searchResult}
              name={searchResult.name}
              artists={searchResult.artists.map(artist => artist.name).join(', ')}
              duration={searchResult.duration_ms}
              overridePlayingContext={this.props.overridePlayingContext}
              queueTrack={this.props.queueTrack}
            />
          ))
          : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  results: state.search.results,
});

const mapDispatchToProps = dispatch => ({
  overridePlayingContext: track => dispatch(overridePlayingContext(track)),
  queueTrack: track => dispatch(queueTrack(track)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
