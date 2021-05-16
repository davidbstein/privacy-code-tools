import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  userChangeQuestionMeta,
  userChangeValue,
  userClickSave,
} from 'src/actions/userActions';
import {
  apiAutoSave,
} from 'src/actions/api';

const mapStateToProps = state => ({
  model: state.model,
  localState: state.localState
});


class ConfidenceSilder extends Component {
  constructor(props, context) {
    super(props);
    this.optionChanged = this.optionChanged.bind(this);
  }

  optionChanged(e) {
    this.props.changeHandler(e.target.value);
  }

  render() {
    return <div className="coding-form-confidence-options-container">
      confidence:
      <div className="coding-form-confidence-options">
        <input
          onChange={this.optionChanged}
          className="coding-form-confidence-option"
          type="radio" id="very_low" name="confidence" value="1"
          checked={this.props.selected == "1"}
        />
        <label htmlFor="very_low"> very low </label>
        <input
          onChange={this.optionChanged}
          className="coding-form-confidence-option"
          type="radio" id="low" name="confidence" value="2"
          checked={this.props.selected == "2"}
        />
        <label htmlFor="low"> low </label>
        <input
          onChange={this.optionChanged}
          className="coding-form-confidence-option"
          type="radio" id="medium" name="confidence" value="3"
          checked={this.props.selected == "3"}
        />
        <label htmlFor="medium"> medium </label>
        <input
          onChange={this.optionChanged}
          className="coding-form-confidence-option"
          type="radio" id="high" name="confidence" value="4"
          checked={this.props.selected == "4"}
        />
        <label htmlFor="high"> high </label>
        <input
          onChange={this.optionChanged}
          className="coding-form-confidence-option"
          type="radio" id="very_high" name="confidence" value="5"
          checked={this.props.selected == "5"}
        />
        <label htmlFor="very_high"> very high </label>
      </div>
    </div>
  }
}


export default connect(
  mapStateToProps,
  { userChangeQuestionMeta, apiAutoSave } // functions
)(
  class QuestionValueCommentBox extends Component {
    constructor(props, context) {
      super(props);
      this.commentChanged = _.debounce(this.commentChanged.bind(this), 1000);
      this.handleCommentChange = this.handleCommentChange.bind(this);
      this.confidenceChanged = this.confidenceChanged.bind(this);
    }

    handleCommentChange(e) {
      const comment = e.target.value;
      this.commentChanged(comment)
    }

    commentChanged(comment) {
      this.props.userChangeQuestionMeta(
        this.props.question_idx, this.props.question_identifier, "comment", comment
      );
      this.props.apiAutoSave();
    }

    confidenceChanged(confidence_level) {
      this.props.userChangeQuestionMeta(
        this.props.question_idx, this.props.question_identifier, "confidence", confidence_level
      );
      this.props.apiAutoSave();
    }

    render() {
      return <div className="coding-form-question-meta">
        <hr />
        <ConfidenceSilder
          changeHandler={this.confidenceChanged}
          selected={this.props.values.confidence}
        />
        <textarea
          className="coding-form-comment-box-textarea"
          placeholder="additional comments"
          onChange={this.handleCommentChange}
          defaultValue={this.props.values.comment}
        />
      </div>
    }
  }
)
