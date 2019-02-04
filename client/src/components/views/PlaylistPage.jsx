import React, { Component } from 'react';
import { connect } from 'react-redux';
import { queuePlaylist } from '../../../../actions/queueActions';
import TrackListItem from './TrackListItem';

class PlaylistPage extends Component {
  render() {
    const { queuePlaylist, playlist, user } = this.props;
    return (
      <div className="playlist-tab">
        {playlist
          ? (
            <div className="playlist-container-2">
              <div className="playlist-header">
                <img id="playlist-album-art" src={playlist.albumArt} />
                <div className="playlist-header-info">
                  <h1 className="playlist-header-name">{playlist.name}</h1>
                  <div className="playlist-header-created-by">{`Created by ${playlist.owner}`}</div>
                  <div className="add-playlist-to-queue-btn" onClick={() => queuePlaylist(playlist, user)}>
                    <button className="btn-clear add-playlist-to-queue-icon">
                      <i className="material-icons md-36">add</i>
                    </button>
                    <span>Add playlist to queue</span>
                  </div>
                </div>
              </div>
              {playlist.tracks.map(track => (
                <TrackListItem
                  key={track.track.uri}
                  track={track.track}
                />
              ))}
            </div>
          ) : (
            null
          )
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  playlistId: state.view.pageHistory.item,
  playlist: state.view.playlistHash[state.view.pageHistory.item],
  user: state.session.user,
});

const mapDispatchToProps = dispatch => ({
  queuePlaylist: (playlist, user) => dispatch(queuePlaylist(playlist, user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistPage);


// tracks.map(track => (
//   <TrackListItem
//     key={track.track.uri}
//     track={track.track}
//   />
// ))
