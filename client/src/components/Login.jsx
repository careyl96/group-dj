import React from 'react';
import { connect } from 'react-redux';
import { login } from '../../../actions/sessionActions';

const Login = props => (
  <div className="login-page">
    <div className="login-background" />
    <div className="login-wrapper">
      <div className="welcome-message">Welcome to Group DJ</div>
      <div className="login-btn" onClick={props.login}> Log in with Spotify </div>
    </div>
  </div>
);

const mapDispatchToProps = dispatch => ({
  login: () => dispatch(login()),
});

export default connect(null, mapDispatchToProps)(Login);
