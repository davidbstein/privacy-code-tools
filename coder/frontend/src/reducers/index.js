import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import model from 'src/reducers/model';
import localState from 'src/reducers/localState';
import codingProgressStore from 'src/reducers/codingProgressStore'

export default combineReducers({
  form: formReducer,
  model, localState, codingProgressStore
});