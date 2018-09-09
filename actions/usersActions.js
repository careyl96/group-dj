import axios from 'axios';
import * as types from './types';

export const updateUsers = users => ({
  type: types.UPDATE_USERS,
  users,
});

export const fetchUsers = () => (dispatch) => {
  axios.get('/api/users')
    .then(res => dispatch(updateUsers(res)))
    .catch(err => console.log(err));
};
