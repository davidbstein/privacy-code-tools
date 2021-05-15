
import _ from 'lodash';
import {
  API_GET_CODING_PROGRESS
} from 'src/actions/types';

const defaultState = {
}


export default (state = defaultState, action) => {
  switch (action.type) {
    case API_GET_CODING_PROGRESS:
      return action.payload.data;
    default:
      return state
  }
};