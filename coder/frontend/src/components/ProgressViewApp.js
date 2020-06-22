import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  apiGetCodingProgress
} from '../actions/api';

const mapStateToProps = state => ({
  codingProgress: state.codingProgressStore
});

class ProgressViewApp extends Component {
  constructor(props) {
    super(props);
    this.props.apiGetCodingProgress();
  }

  render() {
    if (!this.props.codingProgress) return <div>loading....</div>;
    return (
      <div className="container">
        <div className="progress-view">
          <h1> Progress </h1>
          <div id="progress-view-table">
            <table>
              <thead>
                <tr>
                  <th> Policy (link to merge view) </th>
                  <th> questions answered </th>
                </tr>
              </thead>
              <tbody>
                {_.map(this.props.codingProgress, (e, i) => (
                  <tr key={i}>
                    <td><a href={`/code-merge/${e.policy_instance_id}`}>{e.company_name}</a></td>
                    <td>{_.map(e.coding_instances, (ci, i) => (
                        <div className="progress-view-coding-instance" key={i}>
                          <div className="progress-view-coder-email">{ci.email}</div>
                          <div className="progress-view-coder-count"> {ci.response_count} / 101 complete</div>
                        </div>
                      ))}
                    </td>
                  </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  { apiGetCodingProgress }
)(ProgressViewApp);
