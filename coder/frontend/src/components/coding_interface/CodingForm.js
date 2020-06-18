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

const _stringifySentences = (sentences) => {
  const to_ret = []
  for (var doc in sentences) {
    for (var p in sentences[doc]) {
      to_ret.push(`${doc}❡${p}(${sentences[doc][p].join(',')})`)
    }
  }
  return to_ret;
}

class MergeItem extends Component {
  render() {
    const selectedValues = _.map(
      this.props.values,
      (v,k) => v?k:undefined
      ).filter(e=>e);
    return <div>
      {this.props.fmw_answer?<div className="merge-tool-response-header"><b>FMW's response</b></div>:""}
      <div className={"merge-tool-response" + (this.props.fmw_answer?" fmw-answer": "")}>
        <div className="merge-tool-coder-email">
          {this.props.author}
        </div>
        <div className="merge-tool-response-values">
          {selectedValues.map((value, i)=> <span key={i}>{value}</span>)}
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
        <div className="merge-tool-sentences">
          {this.props.sentences.map((s, i) => <div key={i}> {s} </div>)}
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
      const responses = this.props.mergeData.responses;
      const sentence_strings = _.map(responses, (r) => {
        return _stringifySentences(r.sentences);
      });
      const agreed_sentences = _.intersection(...sentence_strings)
      console.log(sentence_strings, agreed_sentences);
      return <div className="merge-tool-response-list">
        {responses.map((vals, idx_) => {
          if (!vals) return;
          return <MergeItem
            key={idx_}
            values={vals.values}
            confidence={vals.confidence}
            comment={vals.comment}
            sentences={_.difference(sentence_strings[idx_], agreed_sentences)}
            author={this.props.mergeData.authors[idx_]}
            fmw_answer={this.props.mergeData.authors[idx_]=='florencia.m.wurgler@gmail.com'}
          />
        })}
        <div className='merge-tool-agreed-sentences'>
          Sentences highlighted by everyone:
          {agreed_sentences.map((s, i) => <div key={i}> {s} </div>)}
        </div>
      </div>
    }
  }
);

class MergeBoxHeader extends Component {
  render() {
    const responses = this.props.mergeData.responses;
    const answers_match = _.uniqBy(_.map(responses, (r) => {
      return _.filter(_.keys(r.values), (k) => {
          return r.values[k];
        })
      }),
      u=>u.join("--"))
      .length == 1;
    const sentence_strings = _.map(responses, (r) => {
      return _stringifySentences(r.sentences);
    })
    const sentences_match = _.uniqBy(sentence_strings, ss => ss.join('--')).length == 1;
    return <div>
      <div className={`merge-header-answers-match ${(answers_match ?
        'matching-answer-merge':'unmatching-answer-merge')}`}>
        {answers_match ? `answers match` : `answers do not match`}
      </div>
      <div className={`merge-header-sentence-overlap ${(sentences_match ?
        'matching-sentences' : 'unmatching-sentences')}`}>
        {sentences_match ? `sentences match` : `sentences do not match`}
      </div>
      <div> {this.props.mergeData.authors.join(', ')}</div>
    </div>
  }
}

class QuestionBoxHeader extends Component {
  render() {
    return <div>
      {this.props.number_of_sentences} sentence{this.props.number_of_sentences == 1 ? "" : "s"} marked relevant.
      <br/>
      coding: {
        this.props.value_strings.length > 0 ?
        this.props.value_strings.map((s, i) => <span key={i} className='coding-form-response'>{s}</span>) :
        <span className='coding-form-uncoded-marker'>(blank)</span>
      }
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
      this.props.userSelectQuestion(this.props.idx);
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
              <MergeTool question_idx={this.props.idx} mergeData={mergeData} /> : <div /> }
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
            { this.props.localState.merge_mode ?
              <MergeBoxHeader value_strings={value_strings} mergeData={mergeData}/> :
              <QuestionBoxHeader number_of_sentences={number_of_sentences} value_strings={value_strings}/> }
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
