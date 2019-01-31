import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchMyPlaylists } from '../../../../actions/viewActions';
import PlaylistItem from './PlaylistItem';

class MyPlaylists extends Component {
  componentDidMount() {
    if (!this.props.myPlaylists.length) this.props.fetchMyPlaylists();
  }

  render() {
    const { myPlaylists } = this.props;
    return (
      <div className="my-playlists-tab">
        <div className="view-header no-border">My Playlists</div>
        <ul className="playlist-container">
          {myPlaylists
            ? myPlaylists.map(playlist => (
              <PlaylistItem
                key={playlist.id}
                playlist={playlist}
              />
            ))
            : null}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  myPlaylists: state.view.myPlaylists,
});

const mapDispatchToProps = dispatch => ({
  fetchMyPlaylists: () => dispatch(fetchMyPlaylists()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyPlaylists);
