import { combineReducers } from 'redux';
import sessionReducer from './sessionReducer';
import trackReducer from './trackReducer';
import usersReducer from './usersReducer';
import searchReducer from './searchReducer';

const rootReducer = combineReducers({
  session: sessionReducer,
  trackData: trackReducer,
  users: usersReducer,
  search: searchReducer,
});

export default rootReducer;
