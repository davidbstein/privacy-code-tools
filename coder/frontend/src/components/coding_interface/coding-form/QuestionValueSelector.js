import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  userChangeValue,
  userClickSave
} from '../../../actions/userActions';
import {
  apiAutoSave,
} from '../../../actions/api';

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
      this.inputRef = React.createRef();
      this.onClick = this.onClick.bind(this);
      this.onChange = this.onChange.bind(this);
    }
    componentDidUpdate() {
      const other = this.cur_values()["OTHER"];
      if (other && !this._lock_other_filler){
        this.inputRef.current.value = other;
        this._lock_other_filler = true;
      }
    }
    cur_values(){
      return (
        (
        this.props.localState.localCoding[this.props.localState.selectedQuestion]
          || {}
        ).values
          || {}
        );
    }
    is_selected(){
      const cur_values = this.cur_values();
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
          ref={this.inputRef}
          className='coding-form-question-other'
          type='text'
          placeholder='other (enter here)'
          onChange={this.onChange}
          onClick={this.onClick}/>
        </div>
    }
  }
)


export default connect(
  mapStateToProps,
  {userChangeValue, apiAutoSave} // functions
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
      this.props.apiAutoSave();
    }

    silence(value, selected) {
      const new_values = {["SILENT"]: !selected};
      this.props.userChangeValue(this.props.question_idx, new_values)
      this.props.apiAutoSave();
    }

    otherChanged(value) {
      const cur_coding = this.props.localState.localCoding[this.props.localState.selectedQuestion] || {};
      const new_values = {
        ...(cur_coding.values || {}),
        ...{["OTHER"]: value},
      };
      this.props.userChangeValue(this.props.question_idx, new_values);
      this.props.apiAutoSave();
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
