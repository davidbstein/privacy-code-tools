import axios from 'axios';
import { API_GET_POLICY, API_GET_POLICY_INSTANCE, API_GET_CODING, API_POST_CODING_INSTANCE, API_GET_CODING_INSTANCE } from './types';

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var CSRF_TOKEN = getCookie('csrftoken');


export const apiGetPolicies = () => async dispatch => {
  const res = await axios.get(`/api/policy/`)
  dispatch({
    type: API_GET_POLICIES,
    payload: res.data
  })
}

export const apiGetPolicyInstance = (policy_instance_id) => async dispatch => {
  const res = await axios.get(`/api/policy_instance/${policy_instance_id}/`)
  dispatch({
    type: API_GET_POLICY_INSTANCE,
    payload: res.data
  })
  const res2 = await axios.get(`/api/policy/${res.data.policy_id}/`)
  dispatch({
    type: API_GET_POLICY,
    payload: res2.data
  })
}

export const apiGetCoding = (coding_id) => async dispatch => {
  const res = await axios.get(`/api/coding/${coding_id}/`)
  dispatch({
    type: API_GET_CODING,
    payload: res.data
  })
}


export const apiGetCodingInstance = (policy_instance_id, coding_id) => async dispatch => {
  const coder_email = CURRENT_USER;
  const res = await axios.get(`/api/coding_instance/`, {
    params: {policy_instance_id, coding_id, coder_email}
  });
  dispatch({
    type: API_GET_CODING_INSTANCE,
    payload: res.data.results[0] || {}
  })
}


export const apiPostCodingInstance = (policy_instance_id, coding_id, coding_values) => async dispatch => {
  const coder_email = CURRENT_USER;
  const res = await axios.post(`/api/coding_instance/`, {
    policy_instance_id, coding_id, coder_email, coding_values
  }, {
    headers: {'X-CSRFToken': CSRF_TOKEN}
  });
  dispatch({
    type: API_POST_CODING_INSTANCE,
    payload: res.data
  })
}
