import _ from 'lodash';
import axios from 'axios';
import {
  API_AUTO_SAVE,
  API_GET_ALL_CODING_INSTANCE,
  API_GET_CODING,
  API_GET_CODING_INSTANCE,
  API_GET_POLICY,
  API_GET_POLICY_INSTANCE,
  API_POST_CODING_INSTANCE,
} from './types';
import store from '../store'

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

export const apiGetAllCodingInstances = (policy_instance_id, coding_id) => async dispatch => {
  const res = await axios.get(`/api/coding_instance/`, {
    params: {policy_instance_id, coding_id }
  });
  dispatch({
    type: API_GET_ALL_CODING_INSTANCE,
    payload: res.data.results || {}
  })
}


export const apiPostCodingInstance = () => async dispatch => {
  _save_fn(store, dispatch, API_POST_CODING_INSTANCE);
}



/*
 * AUTO SAVE FUNCTION AND BACCKGROUND LISTENERS
 */
var _LAST_AUTO_SAVE = 0;
const _JUMP = 10000;

const _apiAutoSave = (override=false) => async dispatch => {
  const cur_time = new Date().getTime();
  if (override || (_LAST_AUTO_SAVE + _JUMP < cur_time)) {
    _LAST_AUTO_SAVE = cur_time;
  } else {
    console.log("not saving...")
    return;
  }
  console.log('saving...')
  _save_fn(store, dispatch, API_AUTO_SAVE);
}

const _save_fn = async function(store, dispatch, actionName=API_AUTO_SAVE) {
  const state = store.getState();
  const policy_instance_id = state.localState.policyInstanceId;
  const coding_id = state.localState.codingId;
  const coding_values = state.localState.localCoding;
  const coder_email = CURRENT_USER;
  const request_params = {
    policy_instance_id, coding_id, coder_email, coding_values
  }
  const res = await axios.post(`/api/coding_instance/`, request_params, {
    headers: {'X-CSRFToken': CSRF_TOKEN}
  });
  store.dispatch({
    type: actionName,
    payload: res.data
  })
}
const _limited_save_fn = _.debounce(_save_fn, 500)
//AUTO SAVE MAGIC!
setInterval((function(){
  _save_fn(store, store.dispatch);
}).bind(this), 1000*60*5/*five minutes*/)
const _manual_auto_save = (async function(e) {
  if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)  && e.keyCode == 83) {
    e.preventDefault();
    console.log("SAVE");
    _limited_save_fn(store, store.dispatch)
  }
});
document.addEventListener("keydown", _manual_auto_save, false);

export const apiAutoSave = _apiAutoSave;
