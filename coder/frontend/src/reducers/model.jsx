import _ from "lodash";
import { APIActionTypes } from "src/actions/types";

const defaultState = {
  policies: {}, // id: <policyinfo>
  policy_instances: {}, // id: <policyinstance>
  codings: {}, // id: <coding>
  coding_instances: {}, // id: <codinginstance>
  assignments: {}, // id: <coding>
};

/**
 * Takes a list of objects with ids and makes them into an object keyed on id.
 * @param {object[]} objectList
 * @param {Number} objectList[].id
 * @returns
 */
function _wrapObjectList(objectList) {
  const to_ret = {};
  for (var c of objectList) {
    to_ret[c.id] = c;
  }
  return to_ret;
}

/**
 * idempotent state update. replaces entries located at
 * state.<object_type>.<object_id>
 * @param {object} state - the current state, which starts as {@link defaultState} and gets filled in as API calls complete.
 * @param {object} object_copies - objects, keyed on id
 * @param {String} object_type
 * @returns the next state
 */
function _overwrite_stored_object_copies(state, object_copies, object_type) {
  return {
    ...state,
    ...{
      [object_type]: {
        ...state[object_type],
        ...object_copies,
      },
    },
  };
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case APIActionTypes.GET_POLICY:
      return _overwrite_stored_object_copies(state, { ...action.payload, id: action.payload.id }, "policies");
    case APIActionTypes.GET_POLICY_INSTANCE:
      return _overwrite_stored_object_copies(state, { ...action.payload, id: action.payload.id }, "policy_instances");
    case APIActionTypes.GET_CODING:
      return _overwrite_stored_object_copies(state, { ...action.payload, id: action.payload.id }, "codings");
    case APIActionTypes.GET_CODING_INSTANCE:
      return _overwrite_stored_object_copies(state, { ...action.payload, id: action.payload.id }, "coding_instances");
    case APIActionTypes.GET_ALL_CODING_INSTANCE:
      return _overwrite_stored_object_copies(state, _wrapObjectList(action.payload), "coding_instances");
    case APIActionTypes.GET_ASSIGNMENT_LIST:
      return _overwrite_stored_object_copies(state, _wrapObjectList(action.payload), "assignments");
    case APIActionTypes.POST_CODING_INSTANCE:
      return {
        ...state,
        ...{},
      };
    default:
      return state;
  }
};
