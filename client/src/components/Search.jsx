import React, { Component } from 'react';
import axios from 'axios';

class Search extends Component {
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
        type: 'artist',
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    axios(params)
      .then((response) => {
        console.log(response);
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

export default Search;
