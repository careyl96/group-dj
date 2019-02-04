import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchMyPlaylists } from '../../../../actions/viewActions';
import PlaylistItem from './PlaylistItem';

class MyPlaylists extends Component {
  constructor() {
    super();
    this.state = {
      query: '',
    };
  }

  componentDidMount() {
    const { myPlaylists, fetchMyPlaylists } = this.props;
    if (!myPlaylists.length) fetchMyPlaylists();
  }

  handleSearchChange = (e) => {
    this.setState({ query: e.target.value });
    console.log(this.state.query);
  }

  render() {
    const { myPlaylists } = this.props;
    const { query } = this.state;
    return (
      <div className="my-playlists-tab">
        <div className="view-header no-border">My Playlists</div>
        <div className="playlist-filter-container">
          <input type="text" placeholder="Filter" className="playlist-filter" onChange={this.handleSearchChange} />
          <div className="playlist-filter-icon" />
          <div className="playlist-filter-bar" />
        </div>
        <ul className="playlist-container">
          {myPlaylists
            ? myPlaylists.map((playlist) => {
              if (playlist.name.toLowerCase().indexOf(query.toLowerCase()) !== -1 || query === '') {
                return (
                  <PlaylistItem
                    key={playlist.id}
                    playlist={playlist}
                  />
                );
              }
            })
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
