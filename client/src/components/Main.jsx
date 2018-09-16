import React, { Component } from 'react';
import { connect } from 'react-redux';
import Search from './Search';
import Home from './maincontent/Home';
import RecentlyPlayed from './maincontent/RecentlyPlayed';
import MostPlayed from './maincontent/MostPlayed';
import MySongs from './maincontent/MySongs';
import SearchResults from './maincontent/SearchResults';

class Main extends Component {
  renderView = () => {
    const { view } = this.props;
    if (view === 'home') return <Home />;
    if (view === 'recently played') return <RecentlyPlayed />;
    if (view === 'most played') return <MostPlayed />;
    if (view === 'my songs') return <MySongs />;
    if (view === 'search results') return <SearchResults />;
    return null;
  };

  render() {
    return (
      <div className="main-view-container">
        <div className="main-content-spacing">
          <Search />
          {this.renderView()}
          {/* <RecentlyPlayed /> */}
          {/* <MostPlayed /> */}
          {/* YourSongs */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  view: state.view.view,
});

export default connect(mapStateToProps, null)(Main);
