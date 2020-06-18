import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import model from './model';
import localState from './localState';
import codingProgressStore from './codingProgressStore'

export default combineReducers({
  form: formReducer,
  model, localState, codingProgressStore
});