import React, { Component } from 'react';
import { connect } from 'react-redux';
import TrackListItem from './TrackListItem';
import { fetchMySongs } from '../../../../actions/viewActions';

class MySongs extends Component {
  componentDidMount() {
    this.props.fetchMySongs();
  }

  render() {
    const { results } = this.props;
    return (
      <div className="my-songs-tab">
        <div className="main-header">My Songs</div>
        {results
          ? results.map(mySongsResult => (
            <TrackListItem
              key={mySongsResult.uri}
              track={mySongsResult}
            />
          ))
          : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  results: state.view.mySongs,
});

const mapDispatchToProps = dispatch => ({
  fetchMySongs: () => dispatch(fetchMySongs()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MySongs);
