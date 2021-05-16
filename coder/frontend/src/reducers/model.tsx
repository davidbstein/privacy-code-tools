
import _ from 'lodash';
import {
  API_GET_ALL_CODING_INSTANCE,
  API_GET_POLICY,
  API_GET_POLICY_INSTANCE,
  API_GET_CODING,
  API_POST_CODING_INSTANCE,
  API_GET_CODING_INSTANCE
} from 'src/actions/types';

const defaultState = {
  policies: {}, // id: <policyinfo>
  policy_instances: {}, // id: <policyinstance>
  codings: {}, // id: <coding>
  coding_instances: {} // id: <codinginstance>
}


function _wrapCodingList(codingList){
  const to_ret = {}
  for (var c of codingList){
    to_ret[c.id] = c;
  }
  return to_ret;
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case API_GET_POLICY:
      return {
        ...state,
        ...{
          "policies": {
            ...state.policies, ...{[action.payload.id]: action.payload}
          }
        }
      };
    case API_GET_POLICY_INSTANCE:
      return {
        ...state,
        ...{
          "policy_instances": {
            ...state.policy_instances, ...{
              [action.payload.id]: action.payload
            }
          }
        }
      };
    case API_GET_CODING:
      return {
        ...state,
        ...{
          "codings": {
            ...state.codings, ...{[action.payload.id]: action.payload}
          }
        }
      };
    case API_GET_CODING_INSTANCE:
      return {
        ...state,
/*        ...{
          "coding_instances": {
            ...state.coding_instances,
            ...{[action.payload.id]: action.payload}
          }
        }*/
      };
    case API_GET_ALL_CODING_INSTANCE:
      return {
        ...state,
        ...{
          "coding_instances": {
            ...state.coding_instances,
            ..._wrapCodingList(action.payload)
          }
        }
      };
    case API_POST_CODING_INSTANCE:
      return {
        ...state,
        ...{}
      };
    default:
      return state;
  }
};