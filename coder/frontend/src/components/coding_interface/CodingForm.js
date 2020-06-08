import React, { Component } from 'react';
import { connect } from 'react-redux';
import QuestionValueSelector from './coding-form/QuestionValueSelector'
import QuestionValueCommentBox from './coding-form/QuestionValueCommentBox'
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
      const number_of_sentences = _.sum(_.values(sentences).map(e=>_.sum(_.values(e).map(ee=>ee.length))));
      const is_active = this.props.idx == this.props.localState.selectedQuestion;
      const cur_question = (this.props.localState.localCoding[this.props.idx] || {});
      const cur_values = cur_question.values || {};
      const value_strings = _.keys(cur_values)
        .filter((k) => cur_values[k])
        .map((k) => k === "OTHER" ? `OTHER:${cur_values[k]}` : k);
      const classes = "coding-form-question " + (is_active ? "active-question" : "inactive-question")

      return <div className="coding-form-question-container">
        <div className={classes} onClick={is_active ? null : this.handleClick}>
          <div className="coding-form-question-title">
            {this.props.content.question}
          </div>
          <div className="coding-form-question-sentence-count">
            {number_of_sentences} sentence{number_of_sentences == 1 ? "" : "s"} marked relevant.
            <br/>
            coding: {
              value_strings.length > 0 ?
              value_strings.map((s, i) => <span key={i} className='coding-form-response'>{s}</span>) :
              <span className='coding-form-uncoded-marker'>(blank)</span>
            }
          </div>
          <div className={is_active ? "active-selection-area" : "inactive-selection-area"}>
            <hr/>
            <div className="coding-form-question-info">
              {this.props.content.info}
            </div>
            <QuestionValueSelector
              values={this.props.content.values}
              question_idx={this.props.idx}
              />
            <QuestionValueCommentBox
              question_idx={this.props.idx}
              values={cur_question}
              />
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
        <div> Coding will be attributed to {CURRENT_USER} </div>
        <div> Please highlight the sentences in the privacy policy that informed the answer to each of the coding values. </div>
        <div> This form will auto-save regularly, but you should still press the "save" button at the bottom to confirm your work is saved. </div>
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
              return <QuestionBox key={i}
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
