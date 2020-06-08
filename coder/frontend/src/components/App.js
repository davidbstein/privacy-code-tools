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
import MergeApp from './MergeApp'
import { Provider } from 'react-redux';
import store from '../store';

function CodingAppWrapper() {
  let { policy_instance_id } = useParams();
  const coding_id = 2;
  return <CodingInterfaceApp policy_instance_id={policy_instance_id} coding_id={coding_id}/>
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Switch>
            <Route path="/code-policy/:policy_instance_id">
              <CodingAppWrapper />
            </Route>
            <Route path="/code-merge/{}">
              <MergeApp />
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
