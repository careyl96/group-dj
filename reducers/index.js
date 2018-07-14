import { combineReducers } from 'redux';
import sessionReducer from './sessionReducer';
import trackReducer from './trackReducer';

const rootReducer = combineReducers({
  session: sessionReducer,
  trackData: trackReducer,
});

export default rootReducer;
