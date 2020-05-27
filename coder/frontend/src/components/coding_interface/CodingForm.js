import React, { Component } from 'react';
import { connect } from 'react-redux';
import QuestionValueSelector from './coding-form/QuestionValueSelector'
import {
  userSelectQuestion,
  userChangeValue,
  userClickSave
} from '../../actions/userActions';
import {
  apiPostCodingInstance
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
      this.props.userSelectQuestion(this.props.idx)
    }

    render() {
      const sentences = ((this.props.localState.localCoding[this.props.idx]||{}).sentences||[]);
      const number_of_sentences = _.sum(_.values(sentences).map((e)=>e.length));
      const is_active = this.props.idx == this.props.localState.selectedQuestion;
      const cur_values = (this.props.localState.localCoding[this.props.idx] || {}).values || {};
      const value_strings = _.keys(cur_values)
        .filter((k) => cur_values[k])
        .map((k) => k === "OTHER" ? `OTHER:${cur_values[k]}` : k);
      const classes = "coding-form-question" + (is_active ? " active-question" : "")

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
          <div className="coding-form-question-info">
            {this.props.content.info}
          </div>
          <QuestionValueSelector
            values={this.props.content.values}
            question_idx={this.props.idx}
            />
          <div className="coding-form-comment-box" >
            <textarea className="coding-form-comment-box-textarea"
              placeholder="additional comments" /> <i> note: commenting is not yet implemented -stein </i>
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
    }
    userSave() {
      this.props.apiPostCodingInstance(
        this.props.policy_instance_id,
        this.props.coding_id,
        this.props.localState.localCoding
      )
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
              <button onClick={this.userSave}> Save! </button>
            </div>
          </div>
        </div>
      );
    }
  }
);
