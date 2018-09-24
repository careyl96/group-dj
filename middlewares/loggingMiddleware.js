import * as types from '../actions/types';

export default store => next => (action) => {
  const result = next(action);
  switch (action.type) {
    default:
      break;
  }
  return result;
};
