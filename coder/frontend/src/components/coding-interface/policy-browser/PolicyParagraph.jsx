import React, { Component } from "react";
import _ from "lodash";
import PolicySentence from "./PolicySentence";

export default class PolicyParagraph extends Component {
  render() {
    var is_header = "";
    if ((this.props.content[0] || "").startsWith("§")) is_header += " is-header ";
    return (
      <div className="policy-browser-paragraph" id={`paragraph-${this.props.policy_type}-${this.props.idx}`}>
        <div className="policy-browser-paragraph-num">{this.props.idx + 1}</div>
        <div className={"policy-browser-paragraph-content" + is_header}>
          {this.props.content.map((sentence_content, i) => (
            <PolicySentence
              idx={i}
              key={i}
              policy_type={this.props.policy_type}
              paragraph_idx={this.props.idx}
              content={sentence_content}
            />
          ))}
        </div>
      </div>
    );
  }
}
