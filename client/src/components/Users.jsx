import React, { Component } from 'react';
import { connect } from 'react-redux';

const Users = ({ users, playingContext }) => (
  <div className="users-container sidebar">
    <div className="online">online users</div>
    <ul className="users-list">
      {users.length
        ? users.map((user, index) => {
          const { avatar, username } = user;
          return (
            <li key={index} className="user-list-item">
              <div className="user-img-container">
                <img className="user-img" src={avatar} />
                {playingContext.user && user.id === playingContext.user.id
                  ? (
                    <div className="volume-overlay">
                      <i className="material-icons md-light md-24 icon-user-track">volume_up</i>
                    </div>
                  ) : null
                }
              </div>
              <div className="username">{username}</div>
            </li>
          );
        })
        : null}
    </ul>
  </div>
);

const mapStateToProps = state => ({
  users: state.users,
  playingContext: state.playingContext,
});

export default connect(mapStateToProps, null)(Users);
