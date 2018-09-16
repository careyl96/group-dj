import React, { Component } from 'react';
import { connect } from 'react-redux';
import { searchTracks } from '../../../actions/searchActions';
import { updateView } from '../../../actions/sessionActions';

class Search extends Component {
  constructor() {
    super();
    this.state = {
      query: '',
    };
  }

  handleSearchChange = (e) => {
    const query = e.target.value;
    this.setState({ query });
  }

  render() {
    return (
      <div className="search-container">
        <button className="back-button">&lt;</button>
        <button className="forward-button">&gt;</button>
        <input type="text" placeholder="Search" className="search-bar" onChange={this.handleSearchChange} />
        <button className="search-button" onClick={() => this.props.searchTracks(this.state.query)}>Go</button>
      </div>
    );
  }
}

// const mapStateToProps = state => ({
//   accessToken: state.session.accessToken,
// });

const mapDispatchToProps = dispatch => ({
  searchTracks: query => dispatch(searchTracks(query)),
  updateView: view => dispatch(updateView(view)),
});

export default connect(null, mapDispatchToProps)(Search);
