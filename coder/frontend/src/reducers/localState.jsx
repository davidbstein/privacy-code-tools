import _ from "lodash";
import { APIActionTypes, AppActionTypes, NULL_OP, UserActionsTypes } from "src/actions/types";

/**
 * @constant {LocalState} defaultState
 */
const defaultState = {
  selectedQuestion: "-1",
  selectedQuestionIdentifier: "-1",
  localCodingInstance: {}, // the current coding values
  localCodings: {}, // for coding editing
  updateSinceLastSave: true,
};

/**
 * @returns {QuestionAnswer}
 */
function get_default_question() {
  return {
    values: {},
    sentences: {
      privacy_policy: {},
      tos: {},
      ccpa_policy: {},
      gdpr_policy: {},
    },
    comment: "",
    confidence: null,
  };
}

/**
 * action.payload =
 */
function template(state, action) {
  console.log(state, action);
  return state;
}

/**
 * action.payload = {question_idx, value}
 */
function changeValue(state, action) {
  var current_value =
    state.localCodingInstance[action.payload.question_identifier] ||
    state.localCodingInstance[action.payload.question_idx];
  if (current_value === undefined) {
    current_value = get_default_question();
  }
  const new_value = {
    ...current_value,
    ...{ values: action.payload.values },
  };
  return {
    ...state,
    ...{
      localCodingInstance: {
        ...state.localCodingInstance,
        ...{ [action.payload.question_idx]: new_value },
        ...{ [action.payload.question_identifier]: new_value },
      },
    },
  };
}

function changeQuestionMeta(state, action) {
  const next_state = { ...state };
  next_state.localCodingInstance[action.payload.question_idx] = {
    ...(state.localCodingInstance[action.payload.question_idx] || get_default_question()),
    ...{ [action.payload.field]: action.payload.value },
  };
  next_state.localCodingInstance[action.payload.question_identifier] = {
    ...(state.localCodingInstance[action.payload.question_identifier] || get_default_question()),
    ...{ [action.payload.field]: action.payload.value },
  };
  return next_state;
}

/**
 * toggles the presense of sentence_idx in the array:
 * ```
 *     state.localCodingInstance[<question_idx>].sentences[<paragraph_idx>]
 * ````
 *
 * action.payload = {paragraph_idx, sentence_idx}
 */
function toggleSentence(state, action) {
  var current_value =
    state.localCodingInstance[state.selectedQuestion] || state.localCodingInstance[state.selectedQuestionIdentifier];
  if (current_value === undefined) {
    current_value = get_default_question();
  }

  var new_policy_sentences = { ...current_value.sentences[action.payload.policy_type] };
  if (!new_policy_sentences[action.payload.paragraph_idx]) {
    new_policy_sentences[action.payload.paragraph_idx] = [action.payload.sentence_idx];
  } else if (new_policy_sentences[action.payload.paragraph_idx].indexOf(action.payload.sentence_idx) < 0) {
    new_policy_sentences[action.payload.paragraph_idx].push(action.payload.sentence_idx);
  } else {
    new_policy_sentences[action.payload.paragraph_idx] = new_policy_sentences[action.payload.paragraph_idx].filter(
      (e) => e !== action.payload.sentence_idx
    );
  }

  const new_value = {
    ...current_value,
    ...{
      sentences: {
        ...current_value.sentences,
        ...{ [action.payload.policy_type]: new_policy_sentences },
      },
    },
  };
  return {
    ...state,
    ...{
      localCodingInstance: {
        ...state.localCodingInstance,
        ...{ [state.selectedQuestion]: new_value },
        ...{ [state.selectedQuestionIdentifier]: new_value },
      },
    },
  };
}

/**
 * sets the current vallue of `state.selectedQuestion` to `question_idx`
 *
 * action.payload = {question_idx}
 */
function selectQuestion(state, action) {
  return {
    ...state,
    ...{ selectedQuestion: action.payload.question_idx },
    ...{ selectedQuestionIdentifier: action.payload.question_identifier },
  };
}

/**
 * overrides the local state with the server's last saved coding`
 *
 * action.payload = {}
 */
function loadSavedCodingInstance(state, action) {
  if (!action.payload.coding_values) {
    return state;
  }
  return {
    ...state,
    ...{ localCodingInstance: action.payload.coding_values },
  };
}

/**
 * overrides the local state with the server's last saved coding`
 *
 * action.payload = {}
 */
function loadSavedCodings(state, action) {
  return {
    ...state,
    localCodings: _.fromPairs(_.map(action.payload, (coding) => [coding.id, coding])),
  };
}

function setCurrentView(state, action) {
  return {
    ...state,
    ...{
      policyInstanceId: action.payload.policy_instance_id,
      codingId: action.payload.coding_id,
      merge_mode: action.payload.merge_mode == true,
    },
  };
}

function changeCoding(state, action) {
  return {
    ...state,
    localCodings: {
      ...state.localCodings,
      [action.payload.coding.id]: action.payload.coding,
    },
  };
}

export default (state = defaultState, action) => {
  const new_state = { ...state, ...{ updateSinceLastSave: false }, ...{ updateHackOccured: "" + new Date() } };
  switch (action.type) {
    // updates that don't mutate user input state.
    case AppActionTypes.SET_CURRENT_VIEW:
      return setCurrentView(state, action);
    case APIActionTypes.AUTO_SAVE:
    case APIActionTypes.POST_CODING_INSTANCE:
      new_state.updateSinceLastSave = true;
      return new_state;
    case APIActionTypes.GET_CODING_INSTANCE:
      return loadSavedCodingInstance(new_state, action);
    case APIActionTypes.GET_CODING_LIST:
      return loadSavedCodings(new_state, action);

    // updates that mutate user's input
    case UserActionsTypes.SELECT_QUESTION:
      return selectQuestion(new_state, action);
    case UserActionsTypes.CHANGE_QUESTION_META:
      return changeQuestionMeta(new_state, action);
    case UserActionsTypes.TOGGLE_SENTENCE:
      return toggleSentence(new_state, action);
    case UserActionsTypes.CHANGE_VALUE:
      return changeValue(new_state, action);
    case UserActionsTypes.UPDATE_CODING:
      return changeCoding(new_state, action);

    case NULL_OP:
      return new_state;

    // null action
    default:
      return state;
  }
};
