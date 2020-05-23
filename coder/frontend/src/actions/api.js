import axios from 'axios';
import { API_GET_POLICY, API_GET_POLICY_INSTANCE, API_GET_CODING, API_POST_CODING_INSTANCE, API_GET_CODING_INSTANCE } from './types';

export const apiGetPolicy = (policy_id) => async dispatch => {
  const res = await axios.get(`/api/policy/${policy_id}/`)
  dispatch({
    type: API_GET_POLICY,
    payload: res.data
  })
}

export const apiGetPolicyInstance = (policy_instance_id) => async dispatch => {
  const res = await axios.get(`/api/policy_instance/${policy_instance_id}/`)
  dispatch({
    type: API_GET_POLICY_INSTANCE,
    payload: res.data
  })
}

export const apiGetCoding = (coding_id) => async dispatch => {
  const res = await axios.get(`/api/coding/${coding_id}/`)
  dispatch({
    type: API_GET_CODING,
    payload: res.data
  })
}