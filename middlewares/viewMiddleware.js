import axios from 'axios';
import * as types from '../actions/types';

export default store => next => (action) => {
  const result = next(action);
  switch (action.type) {
    case types.SEARCH_TRACKS:
      break;
    default:
      break;
  }
  return result;
};
