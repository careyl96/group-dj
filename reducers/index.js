import { combineReducers } from 'redux';
import sessionReducer from './sessionReducer';
import trackReducer from './trackReducer';
import usersReducer from './usersReducer';

const rootReducer = combineReducers({
  session: sessionReducer,
  trackData: trackReducer,
  users: usersReducer,
});

export default rootReducer;
