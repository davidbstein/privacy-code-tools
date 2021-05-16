import React, { Component } from 'react';
import { connect } from 'react-redux';
import { apiGetCoding } from 'src/actions/api';
import { useParams } from "react-router-dom";

const mapStateToProps = state => ({
  model: state.model,
  route: useParams()
});


class HomeApp extends Component {
  constructor(props) {
    super(props);
    // do stuff
  }

  render() {
    return (
      <div id='home-page'>
        <h1> Policy Coding Project - Summer 2021 </h1>
        <div id='home-page'>
          <h2> Tasks and Coding </h2>
          <ul>
            <li> <a href={`/c/${this.props.route.project_id}/coder-status`}>Tasks assigned to {CURRENT_USER}</a></li>
            <li> <a href={`/c/${this.props.route.project_id}/coder-status`}>Everyone's todo lists</a></li>
            <li> <a href={`/c/${this.props.route.project_id}/coding-progrss`}>Project Progress</a></li>
          </ul>
          <h2> Documentation </h2>
          <ul>
            <li> <a href={`#`}>[coming soon] Instructions on using the tool</a></li>
            <li> <a href={`#`}>[coming soon] Meeting Notes</a></li>
            <li> <a href={`/c/${this.props.route.project_id}/help`}>Contact info</a></li>
          </ul>
          <h2> Utilities </h2>
          <ul>
            <li> <a href={`/c/${this.props.route.project_id}/coding`}>Coding Editor</a></li>
            <li> <a href={`/c/${this.props.route.project_id}/policy`}>Policy Downloads</a></li>
            <li> <a href={`#`}>[coming soon] Data</a></li>
          </ul>
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  { apiGetCoding }
)(HomeApp);
