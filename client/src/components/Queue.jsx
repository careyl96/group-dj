import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

class Queue extends Component {
  constructor() {
    super();
    this.state = {
      searchQuery: '',
    };
  }

  handleSearchChange = (e) => {
    const searchQuery = e.target.value;
    this.setState({ searchQuery });
  }

  handleSubmit = () => {
    const { accessToken } = this.props;
    const { searchQuery } = this.state;
    const params = {
      method: 'GET',
      url: 'https://api.spotify.com/v1/search',
      params: {
        q: searchQuery,
        type: 'track',
        limit: 10,
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    axios(params)
      .then((response) => {
        console.log(response.data.tracks.items);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div className="search-container">
        <input type="text" placeholder="Search" className="search-bar" onChange={this.handleSearchChange} />
        <button className="search-button" onClick={this.handleSubmit}>Go</button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  accessToken: state.session.accessToken,
});

// const mapDispatchToProps = dispatch => ({
// fetchUsers: () => dispatch(fetchUsers()),
// });

export default connect(mapStateToProps, null)(Queue);
