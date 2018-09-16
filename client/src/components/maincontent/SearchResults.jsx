import React, { Component } from 'react';
import { connect } from 'react-redux';
import TrackListItem from './TrackListItem';
import { overridePlayingContext } from '../../../../actions/trackActions';

const parseMs = (ms) => {
  let result = '';
  let minutes = 0;
  let seconds = 0;

  minutes = Math.floor(ms / 1000 / 60);
  seconds = Math.floor((ms / 1000) % 60);

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  result += `${minutes}:${seconds}`;
  return result;
};

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
              duration={parseMs(searchResult.duration_ms)}
              overridePlayingContext={this.props.overridePlayingContext}
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
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
