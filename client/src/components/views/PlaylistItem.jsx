import React from 'react';
import { connect } from 'react-redux';
import { updateView } from '../../../../actions/viewActions';

const PlaylistItem = ({ playlist, updateView }) => {
  return (
    <li className="playlist-item-container">
      <div className="playlist-item" onClick={() => updateView(`playlist:${playlist.id}`)}>
        <div className="playlist-img-container">
          <img id="playlist-img" alt="playlistArt" src={playlist.images[0].url} />
          <div className="playlist-item-overlay">
            <button className="control-btn playlist-btn" onClick={(e) => { e.stopPropagation() }}>
              <i className="material-icons md-72">play_circle_outline</i>
            </button>
          </div>
        </div>
        <div className="playlist-name">{playlist.name}</div>
      </div>
    </li>
  );
};

const mapDispatchToProps = dispatch => ({
  updateView: view => dispatch(updateView(view)),
});

export default connect(null, mapDispatchToProps)(PlaylistItem);
