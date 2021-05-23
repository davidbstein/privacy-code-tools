import React, { Component } from "react";
import { connect } from "react-redux";
import { apiAutoSave } from "src/actions/api";
import mapStateToProps from "src/components/utils/mapStateToProps";
import PolicyParagraph from "./PolicyParagraph";

export default connect(mapStateToProps, { apiAutoSave })(
  class PolicyPage extends Component {
    constructor(props, context) {
      super(props, context);
    }
    render() {
      const policy = this.props.model.policies[this.props.policy_id];
      if (!policy) {
        return <div />;
      }
      const href = policy.urls[this.props.policy_type];
      return (
        <div className="policy-browser-section-container">
          <div className="policy-browser-section-overview">
            <h3 id={this.props.policy_type}> {this.props.policy_type} </h3>
            <div>
              {" "}
              URL of source document:{" "}
              <a href={href} target="_blank">
                {href}
              </a>{" "}
            </div>
            <div>
              {" "}
              Reference Snapshot{" "}
              <a href={`/raw-policy/${this.props.policy_instance.id}/${this.props.policy_type}`}>
                {" "}
                View Original Snapshot
              </a>
            </div>
            <b>
              {" "}
              if the source document and snapshot disagree, use the snapshot (all policies were preseved at the same
              time)
            </b>
          </div>
          <div className="policy-browser-major-section">
            {this.props.policy_content.map((paragraph_content, i) => {
              return (
                <PolicyParagraph idx={i} content={paragraph_content} policy_type={this.props.policy_type} key={i} />
              );
            })}
          </div>
        </div>
      );
    }
  }
);
