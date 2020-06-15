import React, { Component } from 'react';
import { connect } from 'react-redux';
import QuestionValueSelector from './coding-form/QuestionValueSelector'
import QuestionValueCommentBox from './coding-form/QuestionValueCommentBox'
import _ from 'lodash';
import {
  userChangeValue,
  userClickSave,
  userSelectQuestion,
} from '../../actions/userActions';
import {
  apiPostCodingInstance,
  apiAutoSave,
} from '../../actions/api';


const mapStateToProps = state => ({
  model: state.model,
  localState: state.localState
});


const _sentenceCount = (sentences_by_doc) => {
  return _.sum(_.values(sentences_by_doc).map(e=>_.sum(_.values(e).map(ee=>ee.length))));
}


class MergeItem extends Component {
  render() {
    const selectedValues = _.map(
      this.props.values,
      (v,k) => v?k:undefined
      ).filter(e=>e);
    return <div>
      {this.props.fmw_answer?<div className="merge-tool-response-header"><b>"FMW's response"</b></div>:""}
      <div className={"merge-tool-response" + (this.props.fmw_answer?" fmw-answer": "")}>
        <div className="merge-tool-response-values">
          {selectedValues.map(value=> <span>{value}</span>)}
        </div>
        <div className="merge-tool-sentence-count">
          {_sentenceCount(this.props.sentences)} sentences flagged
        </div>
        <div className="merge-tool-confidence">
          confidence: {this.props.confidence || ""}
        </div>
        <div className="merge-tool-comment">
          {this.props.comment ? this.props.comment : ""}
        </div>
      </div>
    </div>
  }
}

const MergeTool = connect(
  mapStateToProps,
  { userSelectQuestion } // functions
)(
  class MergeTool extends Component {
    render () {
      const responses = []
      const authors = []
      for (var ci of _.values(this.props.model.coding_instances)){
        responses.push(ci.coding_values[this.props.question_idx]);
        authors.push(ci.coder_email);
      }
      return <div className="merge-tool-response-list">
        {responses.map((vals, idx_) => {
          if (!vals) return;
          return <MergeItem
            key={idx_}
            values={vals.values}
            confidence={vals.confidence}
            comment={vals.comment}
            sentences={vals.sentences}
            fmw_answer={authors[idx_]=='florencia.m.wurgler@gmail.com'}
          />
        })}
      </div>
    }
  }
);

const QuestionBox = connect(
  mapStateToProps,
  { userSelectQuestion } // functions
)(
  class QuestionBox extends Component {
    constructor(props, context){
      super(props);
      this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
      this.props.userSelectQuestion(this.props.idx);
    }

    render() {
      const sentences = ((this.props.localState.localCoding[this.props.idx]||{}).sentences||{});
      const number_of_sentences = _sentenceCount(sentences);
      const is_active = this.props.idx == this.props.localState.selectedQuestion;
      const cur_question = (this.props.localState.localCoding[this.props.idx] || {});
      const cur_values = cur_question.values || {};
      const value_strings = _.keys(cur_values)
        .filter((k) => cur_values[k])
        .map((k) => k === "OTHER" ? `OTHER:${cur_values[k]}` : k);
      const classes = "coding-form-question " + (is_active ? "active-question" : "inactive-question")
      const selection_area = <div className={is_active ? "active-selection-area" : "inactive-selection-area"}>
            <hr/>
            <div className="coding-form-question-info">
              {this.props.content.details || ""}
            </div>
            { this.props.localState.merge_mode ?
              <MergeTool question_idx={this.props.idx} /> : <div /> }
            <QuestionValueSelector
              values={this.props.content.values}
              question_idx={this.props.idx}
              />
            <QuestionValueCommentBox
              question_idx={this.props.idx}
              values={cur_question}
              />
          </div>

      return <div className="coding-form-question-container">
        <div className={classes} onClick={is_active ? null : this.handleClick}>
          <div className="coding-form-question-title">
            {this.props.idx+1}. {this.props.content.question}
          </div>
          <div className="coding-form-question-sentence-count">
            {number_of_sentences} sentence{number_of_sentences == 1 ? "" : "s"} marked relevant.
            <br/>
            coding: {
              value_strings.length > 0 ?
              value_strings.map((s, i) => <span key={i} className='coding-form-response'>{s}</span>) :
              <span className='coding-form-uncoded-marker'>(blank)</span>
            }
            <hr/>
            <div className="coding-form-question-info">
              {this.props.content.info}
            </div>
          </div>
          {is_active ? selection_area : <div className="inactive-selection-area"/>}
        </div>
      </div>
    }
  }
)


const CodingOverview = connect(
  mapStateToProps,
  {}
)(
  class CodingOverview extends Component {
    render() {
      if (!true) {
        return <div />
      }
      return <div className="policy-browser-overview">
        <h1> Coding </h1>
        <div> Coding will be attributed to <b>{CURRENT_USER}</b> </div>
        <div> This form will auto-save. You can also press <tt>ctrl+s</tt> (windows), <tt>⌘+s</tt> (mac), or hit the "save" button at the bottom of this form. </div>
      </div>
    }
  }
)



export default connect(
  mapStateToProps,
  { apiPostCodingInstance } // functions
)(
  class CodingForm extends Component {
    constructor(props, context){
      super(props, context);
      this.userSave = this.userSave.bind(this);
      this.userSubmit = this.userSubmit.bind(this);
    }
    userSave() {
      this.props.apiPostCodingInstance(
        this.props.policy_instance_id,
        this.props.coding_id,
        this.props.localState.localCoding
      )
    }
    userSubmit() {
      this.props.apiPostCodingInstance(
        this.props.policy_instance_id,
        this.props.coding_id,
        this.props.localState.localCoding
      )
      window.location.assign('/')
    }
    render() {
      const coding = this.props.model.codings[this.props.coding_id];
      if (coding == undefined) {
        return <div className="coding-form-container">
          loading...
        </div>
      }
      return (
        <div className="coding-form-pane">
          <CodingOverview />
          <div className="coding-form-container">
            {coding.questions.map( (question_content, i) => {
              return <QuestionBox key={"question-box-"+i}
                idx={i}
                content={question_content}
              />
            }
            )}
            <div className="coding-form-button-container">
              <button onClick={this.userSave} className="coding-form-submit-button"> Save </button>
              <button onClick={this.userSubmit} className="coding-form-submit-button"> Save and return home </button>
            </div>
          </div>
        </div>
      );
    }
  }
);
