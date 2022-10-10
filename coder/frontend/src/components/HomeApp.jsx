import React, { Component } from "react";
import { connect } from "react-redux";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";
import withParams from "src/components/utils/withParams";
import { CURRENT_USER } from "src/constants";

class HomeApp extends Component {
  render() {
    const {
      model: {
        project: { settings: { meeting_notes, coding_documentation, question_info } = {} },
      },
      match: {
        params: {project_prefix}
      }
    } = this.props;
    return (
      <div id="home-app">
        <div id="homepage-heading">
          <h1> Policy Coding Project</h1>
          <h2>Summer 2021 </h2>
        </div>
        <div id="annoucements">
          <div className="annoucement">
            <h3>Welcome!</h3>
            <div>This is what an annoucement looks like</div>
          </div>
        </div>
        <div id="main-menu">
          <div className="menu-block">
            <h2> Tasks and Coding </h2>
            <ul>
              <li>
                <a href={`/c/${project_prefix}/coder-status/${CURRENT_USER}`}>Your Tasks</a>
              </li>
              <li>
                <a href={`/c/${project_prefix}/coder-status`}>Everyone's tasks</a>
              </li>
              <li>
                <a href={`/c/${project_prefix}/progress`}>Project Progress</a>
              </li>
            </ul>
          </div>
          <div className="menu-block">
            <h2> Documentation </h2>
            <ul>
              <li>
                <a target="_blank" href={question_info}>
                  Coding Notes
                </a>
              </li>
              <li>
                <a target="_blank" href={coding_documentation}>
                  How to use this tool
                </a>
              </li>
              <li>
                <a target="_blank" href={meeting_notes}>
                  Meeting Notes
                </a>
              </li>
            </ul>
          </div>
          <div className="menu-block">
            <h2> Utilities </h2>
            <ul>
              <li>
                <a href={`/c/${project_prefix}/coding`}>Question Editor</a>
              </li>
              <li>
                <a href={`/c/${project_prefix}/policy`}>View Documents</a>
              </li>
              <li>
                <a href={`#`}>[coming soon] Data Explorer</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default withParams(connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeApp));

