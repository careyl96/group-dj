import React, { Component } from 'react';
import axios from 'axios';
import queryString from 'query-string';
import Login from './Login';
import Layout from './Layout';
// import LoginForm from './LoginForm';

import styled, { injectGlobal } from 'styled-components';

injectGlobal`
  body {
    height: 100vh;
    background-color: lightgray;
    margin: 0;
  }
`;

class App extends Component {
  constructor() {
    super();
    this.state = {
      accessToken: null,
      user: null,
      data: {},
    };
  }

  componentDidMount() {
    const accessToken = queryString.parse(window.location.search).access_token;
    const params = {
      method: 'GET',
      url: 'https://api.spotify.com/v1/me/',
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    axios(params)
      .then((response) => {
        this.setState({
          accessToken,
          user: response.data.display_name,
          data: response,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  renderView() {
    const { accessToken, user } = this.state;
    if (!accessToken) {
      return <Login />;
    }
    return <Layout user={user} accessToken={accessToken} />;
  }

  render() {
    return (
      <div className="container">
        {this.renderView()}
      </div>
    );
  }
}

export default App;
