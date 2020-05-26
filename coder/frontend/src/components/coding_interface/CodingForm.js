import React, { Component } from 'react';
import { connect } from 'react-redux';
import { userSelectQuestion, userChangeValue, userClickSave } from '../../actions/userActions';


const mapStateToProps = state => ({
  model: state.model,
  localState: state.localState
});

const QuestionCheckbox = connect(
  mapStateToProps,
  {} // functions
)(
  class QuestionCheckbox extends Component {
    constructor(props, context){
      super(props, context)
      this.toggle = this.toggle.bind(this);
    }
    is_selected(){
      const cur_values = (this.props.localState.localCoding[this.props.localState.selectedQuestion] || {}).values || [];
      return cur_values[this.props.value];
    }
    toggle() {
      this.props.toggle(this.props.value, this.is_selected());
    }
    render() {
      return <div
        className={"coding-form-question-checkbox " + (this.is_selected() ? "selected" : "unselected")}
        onClick={this.toggle}>
        {this.props.display || this.props.value}
      </div>
    }
  }
)

const OtherField = connect(
  mapStateToProps,
  {} // functions
)(
  class OtherField extends Component {
    constructor(props, context){
      super(props, context);
      this.onClick = this.onClick.bind(this);
      this.onChange = this.onChange.bind(this);
    }
    is_selected(){
      const cur_values = (this.props.localState.localCoding[this.props.localState.selectedQuestion] || {}).values || [];
      return cur_values["OTHER"];
    }
    onClick(e){
      if (this.is_selected() || !e.target.value)
        this.props.setter(false);
      else
        this.props.setter(e.target.value);
    }
    onChange(e){
      this.props.setter(e.target.value);
    }
    render() {
        return <div
          className={"coding-form-question-checkbox " + (this.is_selected() ? "selected" : "unselected")}>
        <input
          className='coding-form-question-other'
          type='text'
          placeholder='other (enter here)'
          onChange={this.onChange}
          onClick={this.onClick}/>
        </div>
    }
  }
)


const QuestionValueSelector = connect(
  mapStateToProps,
  {userChangeValue} // functions
)(
  class QuestionValueSelector extends Component {
    constructor(props, context){
      super(props);
      this.toggle = this.toggle.bind(this);
      this.silence = this.silence.bind(this);
      this.otherChanged = this.otherChanged.bind(this);
    }

    toggle(value, is_selected) {
      const cur_coding = this.props.localState.localCoding[this.props.localState.selectedQuestion] || {};
      const new_values = {
        ...(cur_coding.values || {}),
        ...{[value]: !is_selected},
        ...{["SILENT"]: false}
      }
      this.props.userChangeValue(this.props.question_idx, new_values)
    }

    silence(value, selected) {
      const new_values = {["SILENT"]: !selected};
      this.props.userChangeValue(this.props.question_idx, new_values)
    }

    otherChanged(value) {
      const cur_coding = this.props.localState.localCoding[this.props.localState.selectedQuestion] || {};
      const new_values = {
        ...(cur_coding.values || {}),
        ...{["OTHER"]: value},
      };
      this.props.userChangeValue(this.props.question_idx, new_values);
    }

    render() {
      return <div
        className="coding-form-question-value-selector"
        onClick={this.handleClick} >
        <div>
          {this.props.values.map((val, i) =>
            <QuestionCheckbox key={i}
              value={val}
              question_idx={this.props.question_idx}
              toggle={this.toggle} />
          )}
          <OtherField
            setter={this.otherChanged} />
        </div>
        <div>
          <QuestionCheckbox
            value="SILENT"
            display={"policy is silent"}
            question_idx={this.props.question_idx}
            toggle={this.silence}
            />
        </div>
      </div>
    }
  }
)

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
            coding: {value_strings.length > 0 ? value_strings.map((s, i)=><span key={i}>{s}, </span>) : "(uncoded)"}
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
              placeholder="additional comments" />
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
      </div>
    }
  }
)


class CodingForm extends Component {
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
            <button onClick={this.props.userClickSave}> Save! </button>
          </div>
        </div>
      </div>
    );
  }
}


export default connect(
  mapStateToProps,
  { userClickSave } // functions
)(CodingForm);
