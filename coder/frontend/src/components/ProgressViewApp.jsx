import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { apiGetCodingProgress } from "src/actions/api";
import mapStateToProps from "src/components/utils/mapStateToProps";

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
          <h1>
            {!this.props.codingProgress.length ? (
              <div> Loading data... (should take about 30 seconds, data is cached for 5 minutes once loaded) </div>
            ) : (
              <div>Coding Progress ({this.props.codingProgress.length} / ~305 policies coded)</div>
            )}
          </h1>
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
                    <td>
                      <a href={`/code-merge/${e.policy_instance_id}`}>{e.company_name}</a>
                    </td>
                    <td>
                      {_.map(e.coding_instances, (ci, i) => (
                        <div className="progress-view-coding-instance" key={i}>
                          <div className="progress-view-coder-email">
                            {ci.name} ({ci.email})
                          </div>
                          <div className="progress-view-coder-count">
                            {" "}
                            {ci.response_count} / {ci.target_count}
                          </div>
                          <div className="progress-view-coder-date">started {ci.created.substr(5, 5)}</div>
                          {ci.double_answers ? (
                            <div className="progress-view-coder-double">
                              {ci.double_answers} double answer{ci.double_answers > 1 ? "s" : ""}
                            </div>
                          ) : (
                            <div></div>
                          )}
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

export default connect(mapStateToProps, { apiGetCodingProgress })(ProgressViewApp);
