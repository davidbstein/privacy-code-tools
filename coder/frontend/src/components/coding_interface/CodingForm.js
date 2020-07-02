import React, { Component } from 'react';
import { connect } from 'react-redux';
import QuestionValueSelector from './coding-form/QuestionValueSelector'
import QuestionValueCommentBox from './coding-form/QuestionValueCommentBox'
import _ from 'lodash';
import {
  userSelectQuestion,
} from '../../actions/userActions';
import {
  apiPostCodingInstance,
} from '../../actions/api';
import {
  stringifySentences,
  scrollToSentenceTarget,
 } from '../utils/displayUtils'
import {
  MergeTool,
  MergeBoxHeader,
} from './coding-form/MergeElements'



const mapStateToProps = state => ({
  model: state.model,
  localState: state.localState
});


const _sentenceCount = (sentences_by_doc) => {
  return _.sum(_.values(sentences_by_doc).map(e=>_.sum(_.values(e).map(ee=>ee.length))));
}

// flatten sentences into groups of sentence numbers by paragraph.
// returns tuples of [pretty_string, [doc_type, paragraph_number]]
const _stringifySentences = stringifySentences

const _scrollToSentenceTarget = scrollToSentenceTarget


class QuestionBoxHeader extends Component {
  render() {
    return <div>
      {this.props.number_of_sentences} sentence{this.props.number_of_sentences == 1 ? "" : "s"} marked relevant.
      {
        this.props.value_strings.length > 0 ?
        <div>{this.props.value_strings.map((s, i) => <span key={i} className='coding-form-response'>{s}</span>)}</div> :
        <div className='coding-form-uncoded-marker'>Unanswered</div>
      }
      <div className={`coding-form-confidence-${this.props.confidence}`}> confidence: {this.props.confidence} </div>
    </div>
  }
}

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
      this.props.userSelectQuestion(this.props.idx, this.props.content.identifier);
      window.SESSION_TIMER.run_timer(this.props.content.identifier);
    }

    getMergeData() {
      const to_ret = {responses: [], authors: []}
      for (var ci of _.values(this.props.model.coding_instances)){
        if (ci.coding_values[this.props.idx]){
          to_ret.responses.push(ci.coding_values[this.props.idx]);
          to_ret.authors.push(ci.coder_email);
        }
      }
      const sentences_by_coder = {}
      for (var ci of _.values(this.props.model.coding_instances)){
        const sentences = ((ci.coding_values[this.props.idx] || {}).sentences || {})[this.props.policy_type];
      }
      return to_ret
    }

    render() {
      const mergeData = this.getMergeData()
      const cur_question = (this.props.localState.localCoding[this.props.content.identifier] || this.props.localState.localCoding[this.props.idx] || {});
      const sentences = (cur_question.sentences||{});
      const number_of_sentences = _sentenceCount(sentences);
      const is_active = this.props.idx == this.props.localState.selectedQuestion;
      const cur_values = cur_question.values || {};
      const cur_confidence = cur_question.confidence || "unspecified";
      const value_strings = _.keys(cur_values)
        .filter((k) => cur_values[k])
        .map((k) => k === "OTHER" ? `OTHER:${cur_values[k]}` : k);
      const classes = "coding-form-question " + (is_active ? "active-question" : "inactive-question")
      const selection_area = <div className={is_active ? "active-selection-area" : "inactive-selection-area"}>
            <hr/>
            <div className="question-box-wiki-link"> <a href={`/wiki/questions/${this.props.content.identifier.replace(".", "_")}`} target="_blank"> View additional help on the question </a> </div>
            <div className="coding-form-question-info">
              {this.props.content.details || ""}
            </div>
            { this.props.localState.merge_mode ?
              <MergeTool question_idx={this.props.idx} question_identifier={this.props.content.identifier} mergeData={mergeData} /> : <div /> }
            <div className="coding-form-sentence-list">
              {_stringifySentences(sentences).map((s, i) => (
                <div
                  key={i}
                  onClick={_scrollToSentenceTarget}
                  className="sentence-index-button"
                  target={`paragraph-${s.policy_type}-${s.paragraph_idx}`}>
                  {s.pretty_string}
                </div>
                ))}
            </div>
            <QuestionValueSelector
              question_identifier={this.props.content.identifier}
              question_idx={this.props.idx}
              values={this.props.content.values}
              />
            <QuestionValueCommentBox
              question_identifier={this.props.content.identifier}
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
            { this.props.localState.merge_mode ?
              <MergeBoxHeader value_strings={value_strings} mergeData={mergeData}/> :
              <QuestionBoxHeader number_of_sentences={number_of_sentences} value_strings={value_strings} confidence={cur_confidence}/> }
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
          <CodingOverview coding={coding}/>
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
