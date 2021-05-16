import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { userSelectQuestion } from "src/actions/userActions";
import { sentenceCount } from "src/components/utils/displayUtils";
import { MergeBoxHeader } from "src/components/coding_interface/coding-form/MergeElements";

import QuestionBoxHeader from "./QuestionBoxHeader";
import MultiselectActiveArea from "./MultiselectActiveArea";

const mapStateToProps = (state) => ({
  model: state.model,
  localState: state.localState,
});

/**
 * A question box contains a single question, and behaves and appears differently depending on
 * if it has focus.
 */
export default connect(
  mapStateToProps,
  { userSelectQuestion } // functions
)(
  class QuestionBox extends Component {
    constructor(props, context) {
      super(props);
      this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
      this.props.userSelectQuestion(this.props.idx, this.props.content.identifier);
      // @ts-ignore
      window.SESSION_TIMER.run_timer(this.props.content.identifier);
    }

    getMergeData() {
      const to_ret = { responses: [], authors: [] };
      for (var ci of _.values(this.props.model.coding_instances)) {
        const coding_values = ci.coding_values[this.props.content.identifier] || ci.coding_values[this.props.idx];
        if (coding_values) {
          to_ret.responses.push(coding_values);
          to_ret.authors.push(ci.coder_email);
        }
      }
      // const sentences_by_coder = {}
      // for (var ci of _.values(this.props.model.coding_instances)){
      //   const coding_values = ci.coding_values[this.props.idx] || ci.coding_values[this.props.content.identifier]
      //   const sentences = ((coding_values || {}).sentences || {})[this.props.policy_type];
      // }
      return to_ret;
    }

    render() {
      const mergeData = this.getMergeData();
      const cur_question =
        this.props.localState.localCoding[this.props.content.identifier] ||
        this.props.localState.localCoding[this.props.idx] ||
        {};
      const sentences = cur_question.sentences || {};
      const number_of_sentences = sentenceCount(sentences);
      const is_active = this.props.content.identifier.startsWith(this.props.localState.selectedQuestionIdentifier);
      const cur_values = cur_question.values || {};
      const cur_confidence = cur_question.confidence || "unspecified";
      const value_strings = _.keys(cur_values)
        .filter((k) => cur_values[k])
        .map((k) => (k === "OTHER" ? `OTHER:${cur_values[k]}` : k));
      const classes = "coding-form-question " + (is_active ? "active-question" : "inactive-question");

      const active_area = (
        <MultiselectActiveArea
          content={this.props.content}
          idx={this.props.idx}
          is_active={is_active}
          sentences={sentences}
          cur_question={cur_question}
          mergeData={mergeData}
        />
      );

      return (
        <div className="coding-form-question-container">
          <div className={classes} id={this.props.content.identifier} onClick={is_active ? null : this.handleClick}>
            <div className="coding-form-question-title">
              {this.props.count}. {this.props.content.question} (<i>{this.props.content.identifier}</i>)
            </div>
            <div className="coding-form-question-sentence-count">
              {this.props.localState.merge_mode ? (
                <MergeBoxHeader value_strings={value_strings} mergeData={mergeData} />
              ) : (
                <QuestionBoxHeader
                  number_of_sentences={number_of_sentences}
                  value_strings={value_strings}
                  confidence={cur_confidence}
                  comment={cur_question.comment}
                  question_type={this.props.content.type}
                />
              )}
              <hr />
              <div className="coding-form-question-info">{this.props.content.info}</div>
            </div>
            {is_active ? active_area : <div className="inactive-selection-area" />}
          </div>
        </div>
      );
    }
  }
);
