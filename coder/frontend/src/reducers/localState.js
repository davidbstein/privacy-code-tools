
import _ from 'lodash';
import { USER_SELECT_QUESTION, USER_CHANGE_VALUE, USER_TOGGLE_SENTENCE, USER_CLICK_SAVE, USER_CLICK_RESET } from '../actions/types';

const defaultState = {
  "selectedQuestion": 0,
  "localCoding": {},
}

function get_default_question(){
  return {
    values: {},
    sentences: {}
  }
}

/**
 * action.payload =
 */
function template(state, action){
  console.log(state, action)
  return state
}


/**
 * action.payload = {question_idx, value}
 */
function changeValue(state, action){
  var current_value = state.localCoding[state.selectedQuestion];
  if (current_value === undefined) {
    current_value = get_default_question();
  }
  const new_value = {
    ...current_value,
    ...{values: action.payload.values}
  }
  return {
    ...state,
    ...{localCoding: {
        ...state.localCoding,
        ...{[state.selectedQuestion]: new_value}
      }
    }
  }
}

/**
 * toggles the presense of sentence_idx in the array:
 * ```
 *     state.localCoding[<question_idx>].sentences[<paragraph_idx>]
 * ````
 *
 * action.payload = {paragraph_idx, sentence_idx}
 */
function toggleSentence(state, action){
  var current_value = state.localCoding[state.selectedQuestion];
  if (current_value === undefined) {
    current_value = get_default_question();
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
}

/**
 * sets the current vallue of `state.selectedQuestion` to `question_idx`
 *
 * action.payload = {question_idx}
 */
function selectQuestion(state, action){
  return {
    ...state,
    ...{selectedQuestion: action.payload.question_idx}
  };
}

export default (state = defaultState, action) => {
  //TODO auto-populator might need removal
  switch (action.type) {
    case USER_SELECT_QUESTION:
      return selectQuestion(state, action)
    case USER_TOGGLE_SENTENCE:
      return toggleSentence(state, action)
    case USER_CHANGE_VALUE:
      return changeValue(state, action)
    default:
      return state;
  }
};