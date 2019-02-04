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
    const { query } = this.state;
    const { searchTracks } = this.props;
    if (!query) return;
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => searchTracks(query), 300);
  }

  render() {
    const { hasPreviousPage, hasNextPage, updateView } = this.props;
    return (
      <div className="search-container">
        {hasPreviousPage
          ? <button className="view-nav back-btn" onClick={() => updateView('prev')}>&lt;</button>
          : <button className="view-nav back-btn disabled">&lt;</button>
        }
        {hasNextPage
          ? <button className="view-nav forward-btn" onClick={() => updateView('next')}>&gt;</button>
          : <button className="view-nav forward-btn disabled">&gt;</button>
        }
        <input type="text" placeholder="Search" className="search-bar"
          onClick={() => updateView('search results')}
          onChange={this.handleSearchChange}
          onKeyUp={this.delayedSearch}
        />
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
