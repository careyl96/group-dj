import axios from 'axios';
import * as types from './types';

export const updateView = view => ({
  type: types.UPDATE_VIEW,
  view,
});
