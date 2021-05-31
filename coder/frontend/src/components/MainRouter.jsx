import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AssignmentListApp from "src/components/AssignmentListApp";
import CodingEditorApp from "src/components/CodingEditorApp";
import CodingInterfaceApp from "src/components/CodingInterfaceApp";
import HomeApp from "src/components/HomeApp";
import PolicyApp from "src/components/PolicyApp";
import PolicyInstanceApp from "src/components/PolicyInstanceApp";
import ProgressViewApp from "src/components/ProgressViewApp";
import { DEFAULT_CODING } from "src/constants";
import { connect } from "react-redux";
import { apiGetProjectSettings } from "src/actions/api";
import { extend } from "lodash";

function CodingAppWrapper(props) {
  return (
    <CodingInterfaceApp
      policy_instance_id={props.policy_instance_id}
      coding_id={props.coding_id || DEFAULT_CODING}
      merge_mode={props.mode == "merge"}
    />
  );
}

const PREFIX = `/c/:project_prefix`;

const MainURLSwitch = connect(
  (state) => {
    return {};
  },
  { apiGetProjectSettings }
)(
  class MainURLSwitch extends Component {
    constructor(props) {
      super(props);
      this.props.apiGetProjectSettings(this.props.match.params.project_prefix);
    }
    render() {
      const { path, url } = this.props.match;
      return (
        <Switch>
          {/* CODING TOOL */}
          <Route
            path={`${path}/code-:mode/policy-:policy_instance_id/coding-:coding_id`}
            component={CodingAppWrapper}
          />
          <Route path={`${path}/code-:mode/:policy_instance_id-:policy_name/:coding_id`} component={CodingAppWrapper} />
          <Route path={`${path}/code-:mode/:policy_instance_id-:policy_name`} component={CodingAppWrapper} />
          <Route path={`${path}/code-:mode/:policy_instance_id/:coding_id`} component={CodingAppWrapper} />
          <Route path={`${path}/code-:mode/:policy_instance_id`} component={CodingAppWrapper} />
          {/* DOWNLOADING TOOLS */}
          <Route path={`${path}/policy/:policy_id/:policy_instance_id`} component={PolicyInstanceApp} />
          <Route path={`${path}/policy/:policy_id`} component={PolicyApp} />
          <Route path={`${path}/policy`} component={PolicyApp} />
          <Route path={`${path}/coder-status/:coder_email`} component={AssignmentListApp} />
          <Route path={`${path}/coder-status`} component={AssignmentListApp} />
          {/* CODING EDITOR */}
          <Route path={`${path}/coding/:coding_id`} component={CodingEditorApp} />
          <Route path={`${path}/coding`} component={CodingEditorApp} />
          {/* CODING STATUS PAGES */}
          <Route path={`${path}/coding-progress`} component={ProgressViewApp} />
          <Route path={`${path}`} component={HomeApp} />
        </Switch>
      );
    }
  }
);
export default class MainRouter extends Component {
  render() {
    return (
      <Router>
        <Route path="/c/:project_prefix" component={MainURLSwitch} />
      </Router>
    );
  }
}
