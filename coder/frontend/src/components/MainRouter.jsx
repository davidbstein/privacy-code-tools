import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Switch } from "react-router-dom";
import AssignmentListApp from "src/components/AssignmentListApp";
import CodingEditorApp from "src/components/CodingEditorApp";
import CodingInterfaceApp from "src/components/CodingInterfaceApp";
import HomeApp from "src/components/HomeApp";
import PolicyApp from "src/components/PolicyApp";
import ProgressViewApp from "src/components/ProgressViewApp";
import DataApp from "src/components/DataApp";
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
          <Route path={`policy/:policy_id`} element={<PolicyApp />} />
          <Route path={`policy`} element={<PolicyApp />} />
          <Route path={`coder-status/:coder_email`} element={<AssignmentListApp />} />
          <Route path={`coder-status`} element={<AssignmentListApp />} />
          {/* CODING STATUS PAGES */}
          <Route path={`progress`} element={<ProgressViewApp />} />
          {/* CODING EDITOR */}
          <Route path={`coding/:coding_id`} element={<CodingEditorApp />} />
          <Route path={`coding/`} element={<CodingEditorApp />} />
          <Route path={`data/`} element={<DataApp />} />
        </Routes>
      );
    }
  }
));

export default withParams(connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class MainRouter extends Component {
    constructor(props) {
      super(props);
      this.props.apiGetProjectSettings(window.location.pathname.match(/^\/c\/([^\/]+)/)[1]);
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
));