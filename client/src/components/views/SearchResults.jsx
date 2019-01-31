import React, { Component } from 'react';
import { connect } from 'react-redux';
import TrackListItem from './TrackListItem';

class SearchResults extends Component {
  render() {
    const { results } = this.props;
    return (
      <div className="home-tab">
        <div className="view-header">Results</div>
        {results
          ? results.map((searchResult, index) => (
            <TrackListItem
              key={index}
              track={searchResult}
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
