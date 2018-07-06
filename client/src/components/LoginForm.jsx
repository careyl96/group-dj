import React, { Component } from 'react';
import socket from '../socket';
import { ADD_USER } from '../events';

class LoginForm extends Component {
  constructor() {
    super();
    this.state = {
      nickname: '',
      // error: '',
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const { nickname } = this.state;
    socket.emit(ADD_USER, nickname);
  }

  handleChange = (e) => {
    const nickname = e.target.value;
    this.setState({ nickname });
  }

  render() {
    // const { nickname, error } = this.state;
    return (
      <div className="login" />
    );
  }
}

export default LoginForm;
