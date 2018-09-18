import * as types from '../actions/types';

export default store => next => (action) => {
  const result = next(action);
  switch (action.type) {
    case types.FETCH_TRACK_DATA_SUCCESS:
      console.log('fetch track data success');
      break;
    default:
      break;
  }
  return result;
};
