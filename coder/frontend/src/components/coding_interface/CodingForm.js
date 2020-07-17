import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import QuestionValueSelector from './coding-form/QuestionValueSelector'
import QuestionValueCommentBox from './coding-form/QuestionValueCommentBox'
import {
  userSelectQuestion,
  userNullOp,
} from '../../actions/userActions';
import {
  apiPostCodingInstance,
} from '../../actions/api';
import {
  stringifySentences,
  scrollToSentenceTarget,
  sentenceCount,
 } from '../utils/displayUtils'
import {
  MergeTool,
  MergeBoxHeader,
} from './coding-form/MergeElements'



const mapStateToProps = state => ({
  model: state.model,
  localState: state.localState
});



const MultiselectActiveArea = connect(
  mapStateToProps,
  { userSelectQuestion } // functions
)(
  class MultiselectActiveArea extends Component {
    render() {
      return <div className={this.props.is_active ? "active-selection-area" : "inactive-selection-area"}>
        <hr/>
        <div className="question-box-wiki-link">
          <a href={`/wiki/questions/${this.props.content.identifier.replace(".", "_")}`} target="_blank"> View additional help on the question </a>
        </div>
        <div className="coding-form-question-info">
          {this.props.content.details || ""}
        </div>
          { this.props.localState.merge_mode ?
            <MergeTool
              question_idx={this.props.idx}
              question_identifier={this.props.content.identifier}
              mergeData={this.props.mergeData} /> : <div />
            }
        <div className="coding-form-sentence-list">
          {stringifySentences(this.props.sentences).map((s, i) => (
            <div
              key={i}
              onClick={scrollToSentenceTarget}
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
          singleselect={['singleselect', 'breakout-option'].indexOf(this.props.content.type) > -1}
          />
        <QuestionValueCommentBox
          question_identifier={this.props.content.identifier}
          question_idx={this.props.idx}
          values={this.props.cur_question}
          />
      </div>
    }
  }
)


class QuestionBoxHeader extends Component {
  render() {
    return <div className="coding-form-header-info">
      <div className="coding-form-sentence-count-header">
        {this.props.number_of_sentences} sentence{this.props.number_of_sentences == 1 ? "" : "s"}
      </div>
      <div className="coding-form-answers-header">
      {
        this.props.value_strings.length > 0 ?
        <div>{this.props.value_strings.map((s, i) => <span key={i} className='coding-form-response'>{s}</span>)}</div> :
        <div className='coding-form-uncoded-marker'>Unanswered</div>
      }
      </div>
      <div className={this.props.comment ? `coding-form-comment-notification` : `hidden`}> 
        has comment!
      </div>
      <div className={`coding-form-confidence coding-form-confidence-${this.props.confidence}`}> 
        confidence: {this.props.confidence} 
      </div>
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
        const coding_values = ci.coding_values[this.props.content.identifier] || ci.coding_values[this.props.idx]
        if (coding_values){
          to_ret.responses.push(coding_values);
          to_ret.authors.push(ci.coder_email);
        }
      }
      // const sentences_by_coder = {}
      // for (var ci of _.values(this.props.model.coding_instances)){
      //   const coding_values = ci.coding_values[this.props.idx] || ci.coding_values[this.props.content.identifier]
      //   const sentences = ((coding_values || {}).sentences || {})[this.props.policy_type];
      // }
      return to_ret
    }

    render() {
      const mergeData = this.getMergeData()
      const cur_question = (this.props.localState.localCoding[this.props.content.identifier] || this.props.localState.localCoding[this.props.idx] || {});
      const sentences = (cur_question.sentences||{});
      const number_of_sentences = sentenceCount(sentences);
      const is_active = this.props.content.identifier.startsWith(this.props.localState.selectedQuestionIdentifier);
      const cur_values = cur_question.values || {};
      const cur_confidence = cur_question.confidence || "unspecified";
      const value_strings = _.keys(cur_values)
        .filter((k) => cur_values[k])
        .map((k) => k === "OTHER" ? `OTHER:${cur_values[k]}` : k);
      const classes = "coding-form-question " + (is_active ? "active-question" : "inactive-question")

      const active_area = <MultiselectActiveArea
        content={this.props.content}
        idx={this.props.idx}
        is_active={is_active}
        sentences={sentences}
        cur_question={cur_question}
        mergeData={mergeData}
      />

      return <div className="coding-form-question-container">
        <div className={classes} id={this.props.content.identifier} onClick={is_active ? null : this.handleClick}>
          <div className="coding-form-question-title">
            {this.props.count}. {this.props.content.question} (<i>{this.props.content.identifier}</i>)
          </div>
          <div className="coding-form-question-sentence-count">
            { this.props.localState.merge_mode ?
              <MergeBoxHeader value_strings={value_strings} mergeData={mergeData}/> :
              <QuestionBoxHeader 
                number_of_sentences={number_of_sentences} 
                value_strings={value_strings} 
                confidence={cur_confidence}
                comment={cur_question.comment}
                /> 
                }
            <hr/>
            <div className="coding-form-question-info">
              {this.props.content.info}
            </div>
          </div>
          {is_active ? active_area : <div className="inactive-selection-area"/>}
        </div>
      </div>
    }
  }
)



const BreakoutHeader = connect(
  mapStateToProps,
  { userSelectQuestion } // functions
)(
  class BreakoutHeader extends Component {
    constructor(props, context){
      super(props);
      this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
      this.props.userSelectQuestion(this.props.idx, this.props.content.identifier);
      window.SESSION_TIMER.run_timer(this.props.content.identifier);
    }

    render() {
      const cur_question = (this.props.localState.localCoding[this.props.content.identifier] || this.props.localState.localCoding[this.props.idx] || {});
      const sentences = (cur_question.sentences||{});
      const number_of_sentences = sentenceCount(sentences);
      const is_active = this.props.content.identifier.startsWith(this.props.localState.selectedQuestionIdentifier.split("(")[0]);
      const cur_values = cur_question.values || {};
      const cur_confidence = cur_question.confidence || "unspecified";
      const value_strings = _.keys(cur_values)
        .filter((k) => cur_values[k])
        .map((k) => k === "OTHER" ? `OTHER:${cur_values[k]}` : k);
      const classes = "coding-form-question " + (is_active ? "active-question" : "inactive-question")

      const active_area = <MultiselectActiveArea
        content={this.props.content}
        idx={this.props.idx}
        is_active={is_active}
        sentences={sentences}
        cur_question={cur_question}
      />

      return <div className="coding-form-breakout-master-container">
        <div className={classes} onClick={is_active ? null : this.handleClick}>
          <div className="coding-form-question-title">
            {this.props.count}. {this.props.content.question}
          </div>
          <div className="coding-form-question-sentence-count">
            <hr/>
            <div className="coding-form-question-info">
              {this.props.content.info}
            </div>
          </div>
        </div>
      </div>
    }
  }
)


const BreakoutOption = connect(
  mapStateToProps,
  { userSelectQuestion } // functions
)(
  class BreakoutOption extends Component {
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
        const coding_values = ci.coding_values[this.props.content.identifier]
        if (coding_values){
          to_ret.responses.push(coding_values);
          to_ret.authors.push(ci.coder_email);
        }
      }
      if (to_ret === undefined)
        console.log(to_ret)
      return to_ret
    }

    render() {
      const mergeData = this.getMergeData()
      const cur_coding = (this.props.localState.localCoding[this.props.content.identifier] || this.props.localState.localCoding[this.props.idx] || {});
      const sentences = (cur_coding.sentences||{});
      const number_of_sentences = sentenceCount(sentences);
      const is_active = this.props.content.identifier == this.props.localState.selectedQuestionIdentifier;
      const is_active_breakout = this.props.content.identifier.startsWith(this.props.localState.selectedQuestionIdentifier.split("(")[0]);
      const cur_values = cur_coding.values || {};
      const cur_confidence = cur_coding.confidence || "unspecified";
      const value_strings = _.keys(cur_values)
        .filter((k) => cur_values[k])
        .map((k) => k === "OTHER" ? `OTHER:${cur_values[k]}` : k);
      const activity_classes = [
        (is_active ? "active-question" : "inactive-question"),
        (is_active_breakout ? "active-breakout" : "inactive-breakout"),
      ].join(' ')

      const active_area = <MultiselectActiveArea
        content={this.props.content}
        idx={this.props.idx}
        is_active={is_active}
        sentences={sentences}
        cur_question={cur_coding}
        mergeData={mergeData}
      />
      return <div className={"coding-form-breakout-option-outer-container " + activity_classes} id={this.props.content.identifier}>
        <div className="coding-form-breakout-option-container">
          <div className={"coding-form-question " + activity_classes} onClick={is_active || (is_active && is_active_breakout) ? null : this.handleClick}>
            <div className="breakout-option-title">
              {this.props.content.question}
            </div>
            <div className="coding-form-question-sentence-count">
              { this.props.localState.merge_mode ?
                <MergeBoxHeader value_strings={value_strings} mergeData={mergeData}/> :
                <QuestionBoxHeader number_of_sentences={number_of_sentences} value_strings={value_strings} confidence={cur_confidence}/> }
            </div>
            {is_active ? active_area : <div className="inactive-selection-area"/>}
          </div>
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

const FloatingControls = connect(
  mapStateToProps, {}
)(
  class FloatingControls extends Component {
    constructor(props, context) {
      super(props, context);
      this.scroll_to_current = this._scroll_to_current.bind(this);
      this.scroll_to_next_disagreement = this._scroll_to_next_disagreement.bind(this);
      this.scroll_to_next_unanswered = this._scroll_to_next_unanswered.bind(this);
    }

    _scroll_to_current() {
      const cur_question_elem = document.getElementById(this.props.localState.selectedQuestionIdentifier)
      if (cur_question_elem) cur_question_elem.scrollIntoView({behavior: "smooth", block: "center"});
    }

    _scroll_to_next_disagreement() {
      const cur_question_elem = document.getElementById(this.props.localState.selectedQuestionIdentifier)
      const unencoded = document.getElementsByClassName('unmatching-answer-merge');
      if (unencoded.length == 0){
        alert("you've answered all the questions!")
      }
      if (!cur_question_elem){
        unencoded[0].scrollIntoView({behavior: "smooth", block: "center"})
        return
      }
      const cur_question_offset = cur_question_elem.offsetTop + cur_question_elem.offsetHeight;
      console.log(cur_question_offset);
      for (var elem of unencoded) {
        if (elem.offsetTop > cur_question_offset) {
          elem.scrollIntoView({behavior: "smooth", block: "center"})
          return
        }
      }
      unencoded[0].scrollIntoView({behavior: "smooth", block: "center"})
    }

    _scroll_to_next_unanswered() {
      const cur_question_elem = document.getElementById(this.props.localState.selectedQuestionIdentifier)
      const unencoded = document.getElementsByClassName('coding-form-uncoded-marker');
      if (unencoded.length == 0){
        alert("you've answered all the questions!")
      }
      if (!cur_question_elem){
        unencoded[0].scrollIntoView({behavior: "smooth", block: "center"})
        return
      }
      const cur_question_offset = cur_question_elem.offsetTop + cur_question_elem.offsetHeight;
      console.log(cur_question_offset);
      for (var elem of unencoded) {
        if (elem.offsetTop > cur_question_offset) {
          elem.scrollIntoView({behavior: "smooth", block: "center"})
          return
        }
      }
      unencoded[0].scrollIntoView({behavior: "smooth", block: "center"})
    }

    render() {
      return <div className="coding-form-floating-controls">
        <div className='coding-form-control-buttons'>
          <div className="scroll-to-note"> scroll to: </div>
          <div 
            className="coding-form-action-button"
            onClick={this.scroll_to_current}>
              Current Question
          </div>
          { 
            this.props.localState.merge_mode ?
            <div
              className='coding-form-action-button'
              onClick={this.scroll_to_next_disagreement}>
                Next Unresolved
            </div> :
            <div 
              className="coding-form-action-button"
              onClick={this.scroll_to_next_unanswered}>
                Next Unanswered 
            </div>
          }
          </div>
        </div>
      }
  }
)

export default connect(
  mapStateToProps,
  { apiPostCodingInstance, userNullOp } // functions
)(
  class CodingForm extends Component {
    constructor(props, context){
      super(props, context);
      this.userSave = this.userSave.bind(this);
      this.userSubmit = this.userSubmit.bind(this);
      this.localStore = this.localStore.bind(this);
      this.restoreStore = this.restoreStore.bind(this);
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
    localStore() {
      window.localStorage.setItem(location.pathname, JSON.stringify(this.props.localState.localCoding));
      alert("The current state of this page has been saved to your browser's memory.")
    }
    restoreStore() {
      const warning_msg = (
        "This will revert to the last time you clicked 'offline save' on this computer." +
        "\n\nAnything you've done since then (on any computer) will be lost forever. \n\ncontinue?")
      if (!window.confirm(warning_msg)) return;
      this.props.localState.localCoding = JSON.parse(window.localStorage.getItem(window.location.pathname));
      this.props.userNullOp()
    }
    fun() {
      alert("hi there!");
    }
    render() {
      const coding = this.props.model.codings[this.props.coding_id];
      if (coding == undefined) {
        return <div className="coding-form-container">
          loading...
        </div>
      }
      var counter = 0;
      return (
        <div className="coding-form-pane">
          <CodingOverview coding={coding}/>
          <div className="coding-form-container">
            {coding.questions.map( (question_content, i) => {
              switch(question_content.type){
                case "multiselect":
                case "singleselect":
                case "breakout":
                  return <QuestionBox
                    key={"question-box-"+i}
                    count={++counter}
                    idx={i}
                    content={question_content}
                  />
                case "breakout-header":
                  return <BreakoutHeader
                    key={"question-box-"+i}
                    count={++counter}
                    idx={i}
                    content={question_content}
                  />
                case "breakout-option":
                  return <BreakoutOption
                      key={"question-box-"+i}
                      count={counter}
                      idx={i}
                      content={question_content}
                    />
              }
            }
            )}
            <div className="coding-form-button-container">
              <button onClick={this.userSave} className="coding-form-submit-button"> Save </button>
              <button onClick={this.userSubmit} className="coding-form-submit-button"> Save and return home </button>
              <button onClick={this.localStore} className="coding-form-submit-button"> [danger!] Offline Save </button>
              <button onClick={this.restoreStore} className="coding-form-submit-button"> [danger!] Restore Last Offline Save </button>
              <button onClick={this.fun} className="coding-form-submit-button"> fun button </button>
            </div>
            <FloatingControls />
          </div>
        </div>
      );
    }
  }
);
