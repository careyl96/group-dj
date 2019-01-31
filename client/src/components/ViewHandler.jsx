import React, { Component } from 'react';
import { connect } from 'react-redux';
import Search from './Search';
import Home from './views/Home';
import RecentlyPlayed from './views/RecentlyPlayed';
import MostPlayed from './views/MostPlayed';
import MySongs from './views/MySongs';
import SearchResults from './views/SearchResults';
import MyPlaylists from './views/MyPlaylists';
import PlaylistPage from './views/PlaylistPage';

class ViewHandler extends Component {
  renderView = () => {
    const { view } = this.props;
    if (view === 'home') return <Home />;
    if (view === 'recently played') return <RecentlyPlayed />;
    if (view === 'most played') return <MostPlayed />;
    if (view === 'my songs') return <MySongs />;
    if (view === 'my playlists') return <MyPlaylists />;
    if (view === 'search results') return <SearchResults />;
    if (typeof view === 'string') return <PlaylistPage />;
    return null;
  };

  render() {
    return (
      <div className="main-view-container">
        <div className="main-content-spacing">
          <Search />
          {this.renderView()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  view: state.view.pageHistory.item,
});

export default connect(mapStateToProps, null)(ViewHandler);
