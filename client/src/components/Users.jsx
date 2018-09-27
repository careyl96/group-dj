import React, { Component } from 'react';
import { connect } from 'react-redux';

const Users = ({ users }) => {
  return (
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
                </div>
                <div className="username">{username}</div>
              </li>
            );
          })
          : null}
      </ul>
    </div>
  );
}

const mapStateToProps = state => ({
  users: state.users,
});

export default connect(mapStateToProps, null)(Users);
