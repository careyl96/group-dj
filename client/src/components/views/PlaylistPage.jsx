import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchPlaylistTracks } from '../../../../actions/viewActions';

class PlaylistPage extends Component {
  componentDidMount() {
    if (!this.props.playlistHash[this.props.playlistId]) {
      this.props.fetchPlaylistTracks(this.props.playlistId);
    }
  }

  render() {
    console.log(this.props);
    return (
      <div className="playlist-tab">
        <div className="playlist-header">
          <img id="playlist-album-art" />
          <div className="flex-vertical">
            <h2 className="now-playing-home-track-name">{name}</h2>
            {/* <button className="add-playlist-queue" onClick={currentlyPlaying ? pausePlayback : resumePlayback}>{currentlyPlaying ? 'Add to queue' : 'Added to queue'}</button> */}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const id = state.view.pageHistory.item;
  return {
    playlistId: id,
    playlistHash: state.view.playlistHash,
    playlist: state.view.playlistHash[id],
  };
};

const mapDispatchToProps = dispatch => ({
  fetchPlaylistTracks: playlistId => dispatch(fetchPlaylistTracks(playlistId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistPage);
