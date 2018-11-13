import React, { Component } from 'react';
import { connect } from 'react-redux';
import TrackListItem from './TrackListItem';
import { fetchMostPlayed } from '../../../../actions/viewActions';

class MostPlayed extends Component {
  componentDidMount() {
    this.props.fetchMostPlayed();
  }

  render() {
    const { results } = this.props;
    return (
      <div className="most-played-tab">
        <div className="main-header">Most Played</div>
        {results
          ? results.map(mostPlayedResult => (
            <TrackListItem
              key={mostPlayedResult.saved_tracks_info.uri}
              track={mostPlayedResult.saved_tracks_info}
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
  fetchMostPlayed: () => dispatch(fetchMostPlayed()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MostPlayed);
