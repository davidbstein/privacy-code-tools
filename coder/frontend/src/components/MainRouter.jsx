import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Switch } from "react-router-dom";
import AssignmentListApp from "src/components/AssignmentListApp";
import CodingEditorApp from "src/components/CodingEditorApp";
import CodingInterfaceApp from "src/components/CodingInterfaceApp";
import HomeApp from "src/components/HomeApp";
import PolicyApp from "src/components/PolicyApp";
import PolicyInstanceApp from "src/components/PolicyInstanceApp";
import ProgressViewApp from "src/components/ProgressViewApp";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";
import withParams from "src/components/utils/withParams";

const PREFIX = `/c/:project_prefix`;

const MainURLSwitch = withParams(connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class MainURLSwitch extends Component {
    render() {
      const {
        model: { project },
      } = this.props;
      if (!project) {
        return <div>one sec...</div>;
      }
      return (
        <Routes>
          {/* CODING TOOL */}
          <Route
            path={`code-:mode/policy-:policy_instance_id/coding-:coding_id`}
            element={<CodingInterfaceApp />}
          />
          <Route
            path={`code-:mode/:policy_instance_id-:policy_name/:coding_id`}
            element={<CodingInterfaceApp />}
          />
          <Route
            path={`code-:mode/:policy_instance_id-:policy_name`}
            element={<CodingInterfaceApp />}
          />
          <Route
            path={`code-:mode/:policy_instance_id/:coding_id`}
            element={<CodingInterfaceApp />}
          />
          <Route path={`code-:mode/:policy_instance_id`} element={<CodingInterfaceApp />} />
          {/* DOWNLOADING TOOLS */}
          <Route
            path={`policy/:policy_id/:policy_instance_id`}
            element={<PolicyInstanceApp />}
          />
          <Route path={`policy/:policy_id`} element={<PolicyApp />} />
          <Route path={`policy`} element={<PolicyApp />} />
          <Route path={`coder-status/:coder_email`} element={<AssignmentListApp />} />
          <Route path={`coder-status`} element={<AssignmentListApp />} />
          {/* CODING STATUS PAGES */}
          <Route path={`progress`} element={<ProgressViewApp />} />
          {/* CODING EDITOR */}
          <Route path={`coding/:coding_id`} element={<CodingEditorApp />} />
          <Route path={`coding/`} element={<CodingEditorApp />} />
        </Routes>
      );
    }
  }
));
export default class MainRouter extends Component {
  constructor(props) {
    super(props);
    this.props.apiGetProjectSettings(this.props.match.params.project_prefix);
  }
  render() {
    return (
      <Router>
        <Routes>
          <Route path="/c/:project_prefix/*" element={<MainURLSwitch />} />
          <Route path="/c/:project_prefix/" element={<HomeApp />} />
        </Routes>
      </Router>
    );
  }
}
