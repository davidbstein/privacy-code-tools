import axios from 'axios';
import {
  NULL_OP,
  USER_AUTO_SAVE,
  USER_CHANGE_QUESTION_META,
  USER_CHANGE_VALUE,
  USER_CLICK_RESET,
  USER_CLICK_SAVE,
  USER_SELECT_QUESTION,
  USER_TOGGLE_SENTENCE,
} from './types';
import _ from 'lodash';

export const userSelectQuestion = (question_idx, question_identifier) => async dispatch => {
  dispatch({
    type: USER_SELECT_QUESTION,
    payload: { question_idx, question_identifier }
  })
}

export const userChangeValue = (question_idx, question_identifier, values) => async dispatch => {
  dispatch({
    type: USER_CHANGE_VALUE,
    payload: { question_idx,  question_identifier, values }
  })
}

export const userToggleSentence = (policy_type, paragraph_idx, sentence_idx) => async dispatch => {
  dispatch({
    type: USER_TOGGLE_SENTENCE,
    payload: { policy_type, paragraph_idx, sentence_idx }
  })
}

export const userChangeQuestionMeta = (question_idx, question_identifier, field, value) => async dispatch => {
  dispatch({
    type: USER_CHANGE_QUESTION_META,
    payload: {question_idx, question_identifier, field, value}
  })
}

export const userClickSave = () => async dispatch => {
  dispatch({
    type: USER_CLICK_SAVE,
    payload: { }
  })
}

export const userClickReset = () => async dispatch => {
  dispatch({
    type: USER_CLICK_RESET,
    payload: { }
  })
}


export const userNullOp = () => async dispatch => {
  dispatch({
    type: NULL_OP,
    payload: { }
  })
}
