import * as types from '../actions/types';

export default store => next => (action) => {
  const result = next(action);
  switch (action.type) {
    case types.FETCH_PLAYING_CONTEXT_SUCCESS:
      console.log('PLAYING CONTEXT UPDATED');
      break;
    default:
      break;
  }
  return result;
};
