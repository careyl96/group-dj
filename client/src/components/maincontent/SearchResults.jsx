import React, { Component } from 'react';
import { connect } from 'react-redux';
import TrackListItem from './TrackListItem';

class SearchResults extends Component {
  render() {
    const { results } = this.props;
    return (
      <div className="home-tab">
        <div className="main-header">Results</div>
        {results
          ? results.map((searchResult, index) => (
            <TrackListItem
              key={index}
              track={searchResult}
              name={searchResult.name}
              artists={searchResult.artists.map(artist => artist.name).join(', ')}
              duration={searchResult.duration_ms}
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

export default connect(mapStateToProps, null)(SearchResults);
