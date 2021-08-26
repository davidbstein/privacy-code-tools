import { APIActionTypes } from "src/actions/types";
import { overwrite_stored_object_copies } from "./utils";

const defaultState = {
  policies: {}, // id: <policyinfo>
  policy_instances: {}, // id: <policyinstance>
  codings: {}, // id: <coding>
  coding_instances: {}, // id: <codinginstance>
  assignments: {}, // id: <coding>
  project: {}, // key: value
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

export default (state = defaultState, action) => {
  switch (action.type) {
    case APIActionTypes.GET_PROJECT_SETTINGS:
      return { ...state, ...{ project: action.payload } };
    case APIActionTypes.GET_POLICY:
      return overwrite_stored_object_copies(
        state,
        { [action.payload.id]: action.payload },
        "policies"
      );
    case APIActionTypes.GET_POLICIES:
      return overwrite_stored_object_copies(state, _wrapObjectList(action.payload), "policies");
    case APIActionTypes.GET_POLICY_INSTANCE:
      return overwrite_stored_object_copies(
        state,
        { [action.payload.id]: action.payload },
        "policy_instances"
      );
    case APIActionTypes.GET_POLICY_INSTANCES:
      return overwrite_stored_object_copies(
        state,
        _wrapObjectList(action.payload),
        "policy_instances"
      );
    case APIActionTypes.GET_CODING_LIST:
      return overwrite_stored_object_copies(state, _wrapObjectList(action.payload), "codings");
    case APIActionTypes.GET_CODING:
      return overwrite_stored_object_copies(
        state,
        { [action.payload.id]: action.payload },
        "codings"
      );
    case APIActionTypes.AUTO_SAVE:
    case APIActionTypes.GET_CODING_INSTANCE:
      return overwrite_stored_object_copies(
        state,
        { [action.payload.id]: action.payload },
        "coding_instances"
      );
    case APIActionTypes.GET_ALL_CODING_INSTANCE:
      return overwrite_stored_object_copies(
        state,
        _wrapObjectList(action.payload),
        "coding_instances"
      );
    case APIActionTypes.GET_ASSIGNMENT_LIST:
      return overwrite_stored_object_copies(state, _wrapObjectList(action.payload), "assignments");
    case APIActionTypes.POST_CODING_INSTANCE:
      return {
        ...state,
        ...{},
      };
    case APIActionTypes.POST_POLICY_INSTANCE_DOCUMENT:
      return state;
    case APIActionTypes.POST_POLICY_INSTANCE:
      return state;
    default:
      return state;
  }
};
