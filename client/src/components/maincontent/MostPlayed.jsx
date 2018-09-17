import React, { Component } from 'react';
import { connect } from 'react-redux';
import TrackListItem from './TrackListItem';
import { overridePlayingContext } from '../../../../actions/trackActions';

class MostPlayed extends Component {
  render() {
    const { results } = this.props;
    return (
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
              overridePlayingContext={this.props.overridePlayingContext}
            />
          ))
          : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  results: state.view.mostPlayed,
});

const mapDispatchToProps = dispatch => ({
  overridePlayingContext: track => dispatch(overridePlayingContext(track)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MostPlayed);
