import React, { Component } from 'react';
import { VERIFY_USER } from '../events';

class LoginForm extends Component {
  constructor() {
    super();
    this.state = {
      nickname: '',
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const { socket } = this.props;
    const { nickname } = this.state;
    socket.emit(VERIFY_USER, nickname, )
  }

  handleChange = (e) => {
    const nickname = e.target.value;
    this.setState({ nickname });
  }

  setUser = () => {
    
  }

  render() {
    const { nickname } = this.state;
    return (
      <div className="login">
        <form onSubmit={this.handleSubmit} className="login-form">
          <label htmlFor="nickname">NICKNAME?</label>
          <input type="text" className="nickname" value={nickname} onChange={this.handleChange} />
        </form>
      </div>
    );
  }
}

export default LoginForm;
