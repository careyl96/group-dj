import React, { Component } from 'react';
import io from 'socket.io-client';
import { USER_CONNECTED, LOGOUT } from '../events';
import LoginForm from './LoginForm';

class App extends Component {
  constructor() {
    super();
    this.state = {
      socket: null,
      user: null,
    };
  }

  componentDidMount() {
    this.initSocket();
  }

  // initialize socket
  initSocket() {
    const socket = io('http://localhost:3006');
    socket.on('connect', () => {
      console.log('connected');
    });
    this.setState({ socket });
  }

  setUser(user) {
    const { socket } = this.state;
    socket.emit(USER_CONNECTED);
    this.setState({ user });
  }


  logout() {
    const { socket } = this.state;
    socket.emit(LOGOUT);
    this.setState({ user: null });
  }

  render() {
    const { socket } = this.state;
    return (
      <div className="container">
        <LoginForm socket={socket} />
        {console.log(`${socket} has connected!`)}
      </div>
    );
  }
}

export default App;
