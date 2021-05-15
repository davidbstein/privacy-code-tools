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
  const merge_mode = props.merge_mode == true;
  coding_id = coding_id || DEFAULT_CODING;
  return <CodingInterfaceApp policy_instance_id={policy_instance_id} coding_id={coding_id} merge_mode={merge_mode}/>
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Switch>

            {/*
              CODING TOOL
            */}
            <Route path={`${this.props.prefix}/code-policy/:policy_instance_id/:coding_id`}>
              <CodingAppWrapper />
            </Route>
            <Route path={`${this.props.prefix}/code-policy/:policy_instance_id`}>
              <CodingAppWrapper />
            </Route>
            <Route path={`${this.props.prefix}/code-merge/:policy_instance_id/:coding_id`}>
              <CodingAppWrapper merge_mode={true} />
            </Route>
            <Route path={`${this.props.prefix}/code-merge/:policy_instance_id`}>
              <CodingAppWrapper merge_mode={true} />
            </Route>

            {/*
              DOWNLOADING TOOLS
            */}
            <Route path={`${this.props.prefix}/policy`}>
              <PolicyApp />
            </Route>
            <Route path={`${this.props.prefix}/policy/:policy_id`}>
              <PolicyApp />
            </Route>
            <Route path={`${this.props.prefix}/policy/:policy_id/:policy_instance_id`}>
              <PolicyInstanceApp />
            </Route>
            <Route path={`${this.props.prefix}/:coder_email`}>
              <CoderStatusApp />
            </Route>

            {/*
              CODING EDITOR
            */}
            <Route path={`${this.props.prefix}/coding`}>
              <CodingApp />
            </Route>
            <Route path={`${this.props.prefix}/coding/:coding`}>
              <CodingEditorApp />
            </Route>

            {/*
              CODING STATUS PAGES
            */}
            <Route path={`${this.props.prefix}/coding-progress`}>
              <ProgressViewApp />
            </Route>
            <Route path={`${this.props.prefix}`}>
              <HomeApp />
            </Route>

          </Switch>
        </Router>
      </Provider>
    );
  }
}


const PREFIX = `/${location.pathname.split("/").slice(1,3).join('/')}`;
ReactDOM.render(<App prefix={PREFIX} />, document.querySelector('#app'));
