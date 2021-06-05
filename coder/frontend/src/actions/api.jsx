import _ from "lodash";
import axios from "axios";
import { APIActionTypes } from "src/actions/types";
import store from "src/store";
import { CURRENT_USER } from "src/constants";
import Logger from "src/Logger";
const log = Logger("api", "cyan");

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
const CSRF_TOKEN = getCookie("csrftoken");

const api = {};

api.apiGetAssignments = () => async (dispatch) => {
  log(`called apiGetAssignments`);
  const res = await axios.get(`/api/assignment/`);
  dispatch({
    type: APIActionTypes.GET_ASSIGNMENT_LIST,
    payload: res.data.results || [],
  });
};

api.apiGetPolicies = () => async (dispatch) => {
  log(`called apiGetPolicies`);
  const res = await axios.get(`/api/policy/`);
  dispatch({
    type: APIActionTypes.GET_POLICIES,
    payload: res.data.results,
  });
};

api.apiGetPolicyInstance = (policy_instance_id) => async (dispatch) => {
  log(`called apiGetPolicyInstance`);
  const res = await axios.get(`/api/policy_instance/${policy_instance_id}/`);
  dispatch({
    type: APIActionTypes.GET_POLICY_INSTANCE,
    payload: res.data,
  });
  const res2 = await axios.get(`/api/policy/${res.data.policy_id}/`);
  dispatch({
    type: APIActionTypes.GET_POLICY,
    payload: res2.data,
  });
};

api.apiGetPolicyAssociatedData = (policy_id) => async (dispatch) => {
  log(`called apiGetPolicyInstance`);
  const res = await axios.get(`/api/policy_instance/?policy_id=${policy_id}`);
  dispatch({
    type: APIActionTypes.GET_POLICY_INSTANCES,
    payload: res.data.results,
  });
  dispatch({
    type: APIActionTypes.GET_POLICY,
    payload: (await axios.get(`/api/policy/${policy_id}/`)).data,
  });
  for (
    let _i = 0, policy_instance = res.data.results[_i++];
    _i < res.data.results.length;
    policy_instance = res.data.results[_i++]
  ) {
    dispatch({
      type: APIActionTypes.GET_ALL_CODING_INSTANCE,
      payload: (await axios.get(`/api/coding_instance/policy_instance_id=${policy_instace.id}`))
        .data.results,
    });
  }
};

api.apiGetCodingList = () => async (dispatch) => {
  log(`called apiGetCodingList`);
  const res = await axios.get(`/api/coding/`);
  dispatch({
    type: APIActionTypes.GET_CODING_LIST,
    payload: res.data.results,
  });
};

api.apiGetCoding = (coding_id) => async (dispatch) => {
  log(`called apiGetCoding`);
  const res = await axios.get(`/api/coding/${coding_id}/`);
  dispatch({
    type: APIActionTypes.GET_CODING,
    payload: res.data,
  });
};

api.apiGetProjectSettings = (project_prefix) => async (dispatch) => {
  log(`called apiGetProjectSettings`);
  const me = await axios.get(`/me`);
  const res = await axios.get(`/api/project/${project_prefix}/`);
  dispatch({
    type: APIActionTypes.GET_PROJECT_SETTINGS,
    payload: { ...res.data, me: me.data },
  });
};

api.apiGetCodingProgress = () => async (dispatch) => {
  log(`called apiGetCodingProgress`);
  const res = await axios.get(`/api/coding_progress/`);
  dispatch({
    type: APIActionTypes.GET_CODING_PROGRESS,
    payload: res.data,
  });
};

api.apiGetCodingInstance = (policy_instance_id, coding_id) => async (dispatch) => {
  log(`called apiGetCodingInstance`);
  const coder_email = CURRENT_USER;
  const res = await axios.get(`/api/coding_instance/`, {
    params: { policy_instance_id, coding_id, coder_email },
  });
  if (res.data.results)
    dispatch({
      type: APIActionTypes.GET_CODING_INSTANCE,
      payload: res.data.results[0],
    });
};

api.apiGetAllCodingInstances = (policy_instance_id, coding_id) => async (dispatch) => {
  log(`called apiGetAllCodingInstances`);
  const res = await axios.get(`/api/coding_instance/`, {
    params: { policy_instance_id, coding_id },
  });
  dispatch({
    type: APIActionTypes.GET_ALL_CODING_INSTANCE,
    payload: res.data.results ?? [{}],
  });
};

api.apiUpdateProjectSettings = (project_prefix, settings) => async (dispatch) => {
  log(`called apiUpdateProjectSettings`);
  const res = await axios.patch(
    `/api/project/${project_prefix}/`,
    { project_settings: settings },
    { headers: { "X-CSRFToken": CSRF_TOKEN } }
  );
  store.dispatch({
    type: APIActionTypes.GET_PROJECT_SETTINGS,
    payload: res.data,
  });
};

api.apiSaveCoding = (coding) => async (dispatch) => {
  log(`called apiSaveCoding`);
  const res = await axios.post(
    `/api/coding/`,
    { ...coding, id: undefined },
    { headers: { "X-CSRFToken": CSRF_TOKEN } }
  );
  store.dispatch({
    type: APIActionTypes.GET_CODING,
    payload: res.data,
  });
};

api.apiUpdateCoding = (coding_id, coding) => async (dispatch) => {
  log(`called apiUpdateCoding`);
  const res = await axios.patch(`/api/coding/${coding_id}/`, coding, {
    headers: { "X-CSRFToken": CSRF_TOKEN },
  });
  store.dispatch({
    type: APIActionTypes.GET_CODING,
    payload: res.data,
  });
};

api.apiPostCodingInstance = () => async (dispatch) => {
  log(`called apiPostCodingInstance`);
  _save_fn(store, dispatch, APIActionTypes.POST_CODING_INSTANCE);
};

/*
 * AUTO SAVE FUNCTION AND BACKGROUND LISTENERS
 */
var _LAST_AUTO_SAVE = 0;
const _JUMP = 10000;

const _apiAutoSave =
  (override = false) =>
  async (dispatch) => {
    const cur_time = new Date().getTime();
    if (override || _LAST_AUTO_SAVE + _JUMP < cur_time) {
      _LAST_AUTO_SAVE = cur_time;
    } else {
      console.log("not saving...");
      return;
    }
    console.log("saving...");
    _save_fn(store, dispatch, APIActionTypes.AUTO_SAVE);
  };

const _save_fn = async function (store, dispatch, actionName = APIActionTypes.AUTO_SAVE) {
  const state = store.getState();
  const policy_instance_id = state.localState.policyInstanceId;
  const coding_id = state.localState.codingId;
  const coding_values = state.localState.localCodingInstance;
  const coder_email = CURRENT_USER;
  const request_params = {
    policy_instance_id,
    coding_id,
    coder_email,
    coding_values,
  };
  const res = await axios.post(`/api/coding_instance/`, request_params, {
    headers: { "X-CSRFToken": CSRF_TOKEN },
  });
  store.dispatch({
    type: actionName,
    payload: res.data,
  });
};
const _limited_save_fn = _.debounce(_save_fn, 500);
//AUTO SAVE MAGIC!
setInterval(
  function () {
    _save_fn(store, store.dispatch);
  }.bind(this),
  1000 * 60 * 5 /*five minutes*/
);
const _manual_auto_save = async function (e) {
  if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.keyCode == 83) {
    e.preventDefault();
    console.log("SAVE");
    _limited_save_fn(store, store.dispatch);
  }
};
document.addEventListener("keydown", _manual_auto_save, false);

api.apiAutoSave = _apiAutoSave;

export default api;
