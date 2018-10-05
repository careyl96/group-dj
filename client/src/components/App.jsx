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
    const { accessToken } = this.props;
    if (!accessToken) {
      return <Login />;
    }
    return <Layout />;
  }

  render() {
    return (
      this.renderView()
    );
  }
}

const mapStateToProps = state => ({
  accessToken: state.session.accessToken,
});

const mapDispatchToProps = dispatch => ({
  load: () => dispatch(load()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
