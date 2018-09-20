import { combineReducers } from 'redux';
import sessionReducer from './sessionReducer';
import trackReducer from './trackReducer';
import usersReducer from './usersReducer';
import searchReducer from './searchReducer';
import viewReducer from './viewReducer';

const rootReducer = combineReducers({
  session: sessionReducer,
  playingContext: trackReducer,
  users: usersReducer,
  search: searchReducer,
  view: viewReducer,
});

export default rootReducer;
