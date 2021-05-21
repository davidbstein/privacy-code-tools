import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch, useParams } from "react-router-dom";

import store from "src/store";

import AssignmentListApp from "src/components/AssignmentListApp";
import CodingApp from "src/components/CodingApp";
import CodingEditorApp from "src/components/CodingEditorApp";
import CodingInterfaceApp from "src/components/CodingInterfaceApp";
import HomeApp from "src/components/HomeApp";
import PolicyApp from "src/components/PolicyApp";
import PolicyInstanceApp from "src/components/PolicyInstanceApp";
import ProgressViewApp from "src/components/ProgressViewApp";
import { DEFAULT_CODING } from "src/constants";

function CodingAppWrapper(props) {
  return (
    <CodingInterfaceApp
      policy_instance_id={props.policy_instance_id}
      coding_id={props.coding_id || DEFAULT_CODING}
      merge_mode={props.mode == "merge"}
    />
  );
}

class App extends Component {
  render() {
    const prefix = this.props.prefix;
    return (
      <Provider store={store}>
        <Router>
          <Switch>
            {/* CODING TOOL */}
            <Route path={`${prefix}/code-:mode/:policy_instance_id/:coding_id`} component={CodingAppWrapper} />
            <Route path={`${prefix}/code-:mode/:policy_instance_id`} component={CodingAppWrapper} />

            {/* DOWNLOADING TOOLS */}
            <Route path={`${prefix}/policy`} component={PolicyApp} />
            <Route path={`${prefix}/policy/:policy_id`} component={PolicyApp} />
            <Route path={`${prefix}/policy/:policy_id/:policy_instance_id`} component={PolicyInstanceApp} />
            <Route path={`${prefix}/coder-status/:coder_email`} component={AssignmentListApp} />
            <Route path={`${prefix}/coder-status`} component={AssignmentListApp} />

            {/* CODING EDITOR */}
            <Route path={`${prefix}/coding`} component={CodingApp} />
            <Route path={`${prefix}/coding/:coding`} component={CodingEditorApp} />

            {/* CODING STATUS PAGES */}
            <Route path={`${prefix}/coding-progress`} component={ProgressViewApp} />
            <Route path={`${prefix}`} component={HomeApp} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}

const PREFIX = `/c/:project_id`;
ReactDOM.render(<App prefix={PREFIX} />, document.querySelector("#app"));
