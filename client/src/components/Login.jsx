import React from 'react';
import styled, { keyframes } from 'styled-components';

const redirect = () => {
  window.location = 'http://localhost:3006/login';
};

const Login = () => (
  <div className="login-page">
    <div className="login-wrapper">
      <div className="welcome-message">Welcome to Group DJ</div>
      <div className="login-button" onClick={redirect}> Log in with Spotify </div>
    </div>
  </div>
);

export default Login;
