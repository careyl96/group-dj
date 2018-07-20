import axios from 'axios';
import store from '../store/store';
import * as types from './types';

export const addToQueue = track => ({
  type: types.ADD_TO_QUEUE,
  track,
});
export const removeFromQueue = track => ({
  type: types.ADD_TO_QUEUE,
  track,
});
