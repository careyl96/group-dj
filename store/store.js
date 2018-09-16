import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/index';
import sessionMiddleware from '../middlewares/sessionMiddleware';
import socketMiddleware from '../middlewares/socketMiddleware';
import searchMiddleware from '../middlewares/searchMiddleware';
import trackMiddleware from '../middlewares/trackMiddleware';

const middleware = applyMiddleware(
  sessionMiddleware,
  socketMiddleware,
  trackMiddleware,
  // devicesMiddleware,
  // loggerMiddleware,
  searchMiddleware,
  thunk,
);


const store = createStore(
  rootReducer,
  composeWithDevTools(middleware),
);

export default store;
