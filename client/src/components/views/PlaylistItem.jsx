import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateView, fetchPlaylistTracks } from '../../../../actions/viewActions';
import { queuePlaylist } from '../../../../actions/queueActions';

class PlaylistItem extends Component {
  componentDidMount() {
    const { playlistHash, playlist, fetchPlaylistTracks } = this.props;
    if (!playlistHash[playlist.id]) fetchPlaylistTracks(playlist);
  }

  renderOverlayPlayBtn() {
    const { queuePlaylist, formattedPlaylist, user } = this.props;
    if (formattedPlaylist) {
      return (
        <button className="control-btn playlist-btn" onClick={(e) => { e.stopPropagation(); queuePlaylist(formattedPlaylist, user); }}>
          <i className="material-icons md-72">play_circle_outline</i>
        </button>
      );
    }
    return (
      <button className="control-btn playlist-btn disabled">
        <i className="material-icons md-72">play_circle_outline</i>
      </button>
    );
  }

  render() {
    const { playlist, updateView } = this.props;
    return (
      <li className="playlist-item-container">
        <div className="playlist-item" role="button" tabIndex={0} onClick={() => updateView(`playlist:${playlist.id}`)}>
          <div className="playlist-img-container">
            <img id="playlist-img" alt="playlistArt" src={playlist.images[0].url} />
            <div className="playlist-item-overlay">
              {this.renderOverlayPlayBtn()}
            </div>
          </div>
          <div className="playlist-name">{playlist.name}</div>
          <div className="playlist-created-by">{`Created by ${playlist.owner.display_name}`}</div>
        </div>
      </li>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: state.session.user,
  playlistHash: state.view.playlistHash,
  formattedPlaylist: state.view.playlistHash[ownProps.playlist.id],
});

const mapDispatchToProps = dispatch => ({
  fetchPlaylistTracks: playlist => dispatch(fetchPlaylistTracks(playlist)),
  updateView: view => dispatch(updateView(view)),
  queuePlaylist: (playlist, user) => dispatch(queuePlaylist(playlist, user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistItem);
