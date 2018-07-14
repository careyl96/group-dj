import React, { Component } from 'react';
import { connect } from 'react-redux';
import Login from './Login';
import Layout from './Layout';
import { validateAccount } from '../../../actions/sessionActions';

import styled, { injectGlobal } from 'styled-components';

injectGlobal`
  body {
    height: 100vh;
    background-color: lightgray;
    margin: 0;
  }
`;

class App extends Component {
  componentDidMount() {
    this.props.validateAccount();
  }

  renderView() {
    const { accessToken, user } = this.props;
    if (!accessToken) {
      return <Login />;
    }
    return <Layout />;
  }

  render() {
    return (
      <div className="container">
        {this.renderView()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  accessToken: state.session.accessToken,
  user: state.session.user,
});

const mapDispatchToProps = dispatch => ({
  validateAccount: () => dispatch(validateAccount()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
