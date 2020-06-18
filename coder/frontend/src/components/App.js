import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";


import CodingInterfaceApp from './CodingInterfaceApp'
import HomeApp from './HomeApp'
import ProgressViewApp from './ProgressViewApp'
import { Provider } from 'react-redux';
import store from '../store';

function CodingAppWrapper(props) {
  let { policy_instance_id, coding_id } = useParams();
  console.log( props, useParams() );
  const merge_mode = props.merge_mode == true;
  coding_id = coding_id || DEFAULT_CODING || 4;
  return <CodingInterfaceApp policy_instance_id={policy_instance_id} coding_id={coding_id} merge_mode={merge_mode}/>
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Switch>
            <Route path="/code-policy/:policy_instance_id/:coding_id">
              <CodingAppWrapper />
            </Route>
            <Route path="/code-policy/:policy_instance_id">
              <CodingAppWrapper />
            </Route>
            <Route path="/code-merge/:policy_instance_id/:coding_id">
              <CodingAppWrapper merge_mode={true} />
            </Route>
            <Route path="/code-merge/:policy_instance_id">
              <CodingAppWrapper merge_mode={true} />
            </Route>
            <Route path="/coding-progress">
              <ProgressViewApp />
            </Route>
            <Route path="">
              <HomeApp />
            </Route>
          </Switch>
        </Router>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#app'));
