import axios from 'axios';
import { USER_SELECT_QUESTION, USER_CHANGE_VALUE, USER_TOGGLE_SENTENCE, USER_CLICK_SAVE, USER_CLICK_RESET } from './types';

export const userSelectQuestion = (question_idx) => async dispatch => {
  dispatch({
    type: USER_SELECT_QUESTION,
    payload: { question_idx }
  })
}

export const userChangeValue = (question_idx, value) => async dispatch => {
  dispatch({
    type: USER_CHANGE_VALUE,
    payload: { question_idx, value }
  })
}

export const userToggleSentence = (paragraph_idx, sentence_idx) => async dispatch => {
  dispatch({
    type: USER_TOGGLE_SENTENCE,
    payload: { paragraph_idx, sentence_idx }
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