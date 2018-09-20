import React, { Component } from 'react';
import { connect } from 'react-redux';
import { searchTracks } from '../../../actions/searchActions';
import { updateView } from '../../../actions/viewActions';

class Search extends Component {
  constructor() {
    super();
    this.state = {
      query: '',
    };
    this.timeout = null;
  }

  handleSearchChange = (e) => {
    const query = e.target.value;
    this.setState({ query });
  }

  delayedSearch = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => this.props.searchTracks(this.state.query), 500);
  }

  render() {
    return (
      <div className="search-container">
        <button className={`view-nav back-button ${this.props.hasPreviousPage ? null : 'disabled'}`} onClick={() => this.props.updateView('prev')}>&lt;</button>
        <button className={`view-nav back-button ${this.props.hasNextPage ? null : 'disabled'}`} onClick={() => this.props.updateView('next')}>&gt;</button>
        <input type="text" placeholder="Search" className="search-bar"
          onClick={() => this.props.updateView('search results')}
          onChange={this.handleSearchChange}
          onKeyUp={this.delayedSearch}
        />
        {/* <button className="search-button" onClick={() => this.props.searchTracks(this.state.query)}>Go</button> */}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  hasPreviousPage: state.view.pageHistory.prev !== null,
  hasNextPage: state.view.pageHistory.next !== null,
});

const mapDispatchToProps = dispatch => ({
  searchTracks: query => dispatch(searchTracks(query)),
  updateView: view => dispatch(updateView(view)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
