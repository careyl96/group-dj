import React from 'react';
import { connect } from 'react-redux';
import TrackListItem from './TrackListItem';

const MostPlayed = ({ results }) => (
  <div className="most-played-tab">
    <div className="main-header">Most Played</div>
    {results
      ? results.map(result => (
        <TrackListItem
          key={result.uri}
          track={result}
          name={result.name}
          artists={result.artists.map(artist => artist.name).join(', ')}
          duration={result.duration_ms}
        />
      ))
      : null}
  </div>
);

const mapStateToProps = state => ({
  results: state.view.mostPlayed,
});

export default connect(mapStateToProps, null)(MostPlayed);
