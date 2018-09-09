import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/index';
import sessionMiddleware from '../middlewares/sessionMiddleware';
import socketMiddleware from '../middlewares/socketMiddleware';

const middleware = applyMiddleware(
  sessionMiddleware,
  socketMiddleware,
  // playbackMiddleware,
  // devicesMiddleware,
  // loggerMiddleware,
  // searchMiddleware,
  thunk,
);


const store = createStore(
  rootReducer,
  composeWithDevTools(middleware),
);

export default store;
