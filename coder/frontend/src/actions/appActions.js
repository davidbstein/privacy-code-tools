import axios from 'axios';
import { APP_SET_CURRENT_VIEW } from 'src/actions/types';
import _ from 'lodash';

export const appSetCurrentView = (policy_instance_id, coding_id, merge_mode) => async dispatch => {
  dispatch({
    type: APP_SET_CURRENT_VIEW,
    payload: { policy_instance_id, coding_id, merge_mode }
  })
}
