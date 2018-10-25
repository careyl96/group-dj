import React, { Component } from 'react';
import { connect } from 'react-redux';
import Login from './Login';
import Layout from './Layout';
import { load } from '../../../actions/sessionActions';

class App extends Component {
  componentDidMount() {
    this.props.load();
  }

  renderView() {
    if (!this.props.fetchingUser && localStorage.getItem('user')) {
      return <Layout />;
    }
    if (!this.props.fetchingUser && !localStorage.getItem('user')) {
      return <Login />;
    }
    return null;
  }

  render() {
    return (
      this.renderView()
    );
  }
}

const mapStateToProps = state => ({
  fetchingUser: state.session.fetchingUser,
});

const mapDispatchToProps = dispatch => ({
  load: () => dispatch(load()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
