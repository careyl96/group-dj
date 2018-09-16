import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { fetchUsers } from '../../../actions/usersActions';

const Users = ({ users }) => {
  return (
    <div className="users-container sidebar">
      <div className="online">online users</div>
      <ul className="users-list">
        {users.length
          ? users.map((user) => {
            const { thumbnail, username } = user;
            return (
              <li key={user} className="user-list-item">
                <div className="user-img-container">
                  <img className="user-img" src={thumbnail} />
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

// const mapDispatchToProps = dispatch => ({
// fetchUsers: () => dispatch(fetchUsers()),
// });

export default connect(mapStateToProps, null)(Users);
