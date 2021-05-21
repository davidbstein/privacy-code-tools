import React, { Component } from "react";
import { CURRENT_USER } from "src/constants";

class HomeApp extends Component {
  render() {
    const {
      match: {
        params: { project_id },
      },
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
                <a href={`/c/${project_id}/coder-status/${CURRENT_USER}`}>Your Tasks</a>
              </li>
              <li>
                <a href={`/c/${project_id}/coder-status`}>Everyone's tasks</a>
              </li>
              <li>
                <a href={`/c/${project_id}/coding-progrss`}>Project Progress</a>
              </li>
            </ul>
          </div>
          <div className="menu-block">
            <h2> Documentation </h2>
            <ul>
              <li>
                <a href={`#`}>[coming soon] Instructions on using the tool</a>
              </li>
              <li>
                <a href={`#`}>[coming soon] Meeting Notes</a>
              </li>
              <li>
                <a href={`/c/${project_id}/help`}>Contact info</a>
              </li>
            </ul>
          </div>
          <div className="menu-block">
            <h2> Utilities </h2>
            <ul>
              <li>
                <a href={`/c/${project_id}/coding`}>Coding Editor</a>
              </li>
              <li>
                <a href={`/c/${project_id}/policy`}>Policy Downloads</a>
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

export default HomeApp;
