import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch, useParams } from "react-router-dom";

import store from "src/store";

import CoderStatusApp from "src/components/CoderStatusApp";
import CodingApp from "src/components/CodingApp";
import CodingEditorApp from "src/components/CodingEditorApp";
import CodingInterfaceApp from "src/components/CodingInterfaceApp";
import HomeApp from "src/components/HomeApp";
import PolicyApp from "src/components/PolicyApp";
import PolicyInstanceApp from "src/components/PolicyInstanceApp";
import ProgressViewApp from "src/components/ProgressViewApp";
import { DEFAULT_CODING } from "src/constants";

function CodingAppWrapper(props) {
  let { policy_instance_id, coding_id } = useParams();
  const merge_mode = props.merge_mode == true;
  coding_id = coding_id || DEFAULT_CODING;
  return <CodingInterfaceApp policy_instance_id={policy_instance_id} coding_id={coding_id} merge_mode={merge_mode} />;
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
            <Route path={`${this.props.prefix}/coder-status/:coder_email`}>
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

const PREFIX = `/c/:project_id`;
ReactDOM.render(<App prefix={PREFIX} />, document.querySelector("#app"));
