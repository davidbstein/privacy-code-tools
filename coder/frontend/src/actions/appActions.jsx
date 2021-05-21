import axios from "axios";
import { AppActionTypes } from "src/actions/types";
import _ from "lodash";

export const appSetCurrentView = (policy_instance_id, coding_id, merge_mode) => async (dispatch) => {
  dispatch({
    type: AppActionTypes.SET_CURRENT_VIEW,
    payload: { policy_instance_id, coding_id, merge_mode },
  });
};
