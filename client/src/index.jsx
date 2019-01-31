import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from '../../store/store';
import App from './components/App';
import '../dist/login.css';
import '../dist/nowplaying.css';
import '../dist/search.css';
import '../dist/users.css';
import '../dist/navbar.css';
import '../dist/main.css';
import '../dist/home.css';
import '../dist/myplaylists.css';
import '../dist/icons.css';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('app'),
);
