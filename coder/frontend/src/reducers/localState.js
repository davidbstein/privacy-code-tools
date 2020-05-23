
import _ from 'lodash';
import { USER_SELECT_QUESTION, USER_CHANGE_VALUE, USER_TOGGLE_SENTENCE, USER_CLICK_SAVE, USER_CLICK_RESET } from '../actions/types';

const defaultState = {
  "selectedQuestion": 0,
  "localCoding": {},
}

export default (state = defaultState, action) => {
  //TODO auto-populator might need removal
  switch (action.type) {
    case USER_SELECT_QUESTION:
      return {
        ...state,
        ...{selectedQuestion: action.payload.question_idx}
      };
    case USER_TOGGLE_SENTENCE:
      var current_value = state.localCoding[state.selectedQuestion];
      if (current_value === undefined) {
        current_value = {value: undefined, sentences: {}}
      }
      var new_sentences = {...current_value.sentences};
      if (!new_sentences[action.payload.paragraph_idx]) {
        new_sentences[action.payload.paragraph_idx] = [action.payload.sentence_idx]
      } else if (new_sentences[action.payload.paragraph_idx].indexOf(action.payload.sentence_idx) < 0){
        new_sentences[action.payload.paragraph_idx].push(action.payload.sentence_idx);
      } else {
        new_sentences[action.payload.paragraph_idx] = new_sentences[action.payload.paragraph_idx].filter((e) => e !== action.payload.sentence_idx);
      }
      const new_value = {
        ...current_value,
        ...{sentences: new_sentences}
      }
      return {
        ...state,
        ...{localCoding: {
            ...state.localCoding,
            ...{[state.selectedQuestion]: new_value}
          }
        }
      }
    default:
      return state;
  }
};