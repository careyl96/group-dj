import React, { Component } from 'react';
import { connect } from 'react-redux';
import Login from './Login';
import Layout from './Layout';
import { load } from '../../../actions/sessionActions';

class App extends Component {
  componentDidMount() {
    this.props.load();
  }

  renderInitView() {
    if (!this.props.fetchingUser && localStorage.getItem('user') && localStorage.getItem('expires_in') - Date.now() > 0) {
      return <Layout />;
    }
    if (!this.props.fetchingUser && (!localStorage.getItem('user') || localStorage.getItem('expires_in') - Date.now() < 0)) {
      return <Login />;
    }
    return null;
  }

  render() {
    return (
      this.renderInitView()
    );
  }
}

const mapStateToProps = state => ({
  fetchingUser: state.session.fetchingUser,
  accessToken: state.session.accessToken,
});

const mapDispatchToProps = dispatch => ({
  load: () => dispatch(load()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
