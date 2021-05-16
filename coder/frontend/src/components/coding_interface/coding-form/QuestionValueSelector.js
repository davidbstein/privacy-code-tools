import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { userChangeValue, userClickSave } from "src/actions/userActions";
import { apiAutoSave } from "src/actions/api";

const mapStateToProps = (state) => ({
  model: state.model,
  localState: state.localState,
});

const QuestionCheckbox = connect(
  mapStateToProps,
  {} // functions
)(
  class QuestionCheckbox extends Component {
    constructor(props, context) {
      super(props, context);
      this.toggle = this.toggle.bind(this);
    }
    is_selected() {
      const cur_values =
        (
          this.props.localState.localCoding[this.props.localState.selectedQuestionIdentifier] ||
          this.props.localState.localCoding[this.props.localState.selectedQuestion] ||
          {}
        ).values || [];
      return cur_values[this.props.value];
    }
    toggle() {
      this.props.toggle(this.props.value, this.is_selected());
    }
    render() {
      return (
        <div
          className={
            "coding-form-question-checkbox " +
            (this.is_selected() ? "selected" : "unselected") +
            (this.props.display ? " has-display" : "")
          }
          onClick={this.toggle}
        >
          {this.props.display || this.props.value}
        </div>
      );
    }
  }
);

const OtherField = connect(
  mapStateToProps,
  {} // functions
)(
  class OtherField extends Component {
    constructor(props, context) {
      super(props, context);
      this.inputRef = React.createRef();
      this.onClick = this.onClick.bind(this);
      this.onChange = this.onChange.bind(this);
    }
    componentDidUpdate() {
      const other = this.cur_values()["OTHER"];
      if (other && !this._lock_other_filler) {
        this.inputRef.current.value = other;
        this._lock_other_filler = true;
      }
    }
    cur_values() {
      return (this.props.localState.localCoding[this.props.localState.selectedQuestion] || {}).values || {};
    }
    is_selected() {
      const cur_values = this.cur_values();
      return cur_values["OTHER"];
    }
    onClick(e) {
      if (this.is_selected() || !e.target.value) this.props.setter(false);
      else this.props.setter(e.target.value);
    }
    onChange(e) {
      this.props.setter(e.target.value);
    }
    render() {
      return (
        <div className={"coding-form-question-checkbox " + (this.is_selected() ? "selected" : "unselected")}>
          <input
            ref={this.inputRef}
            className="coding-form-question-other"
            type="text"
            placeholder="other (enter here)"
            onChange={this.onChange}
            onClick={this.onClick}
          />
        </div>
      );
    }
  }
);

export default connect(
  mapStateToProps,
  { userChangeValue, apiAutoSave } // functions
)(
  class QuestionValueSelector extends Component {
    constructor(props, context) {
      super(props);
      this.toggle = this.toggle.bind(this);
      this.silence = this.silence.bind(this);
      this.otherChanged = _.throttle(this.otherChanged.bind(this), 500, { leading: true, trailing: true });
    }

    toggle(value, is_selected) {
      const cur_coding = this.props.localState.localCoding[this.props.localState.selectedQuestion] || {};
      const cur_coding_values = this.props.singleselect ? {} : cur_coding.values || {};
      const new_values = {
        ...(cur_coding_values || {}),
        ...{ [value]: !is_selected },
        ...{ ["SILENT"]: false },
      };
      this.props.userChangeValue(this.props.question_idx, this.props.question_identifier, new_values);
      this.props.apiAutoSave();
    }

    silence(value, selected) {
      const new_values = { ["SILENT"]: !selected };
      this.props.userChangeValue(this.props.question_idx, this.props.question_identifier, new_values);
      this.props.apiAutoSave();
    }

    otherChanged(value) {
      const cur_coding = this.props.localState.localCoding[this.props.localState.selectedQuestion] || {};
      const cur_coding_values = this.props.singleselect ? {} : cur_coding.values || {};
      const new_values = {
        ...(cur_coding_values || {}),
        ...{ ["OTHER"]: value },
      };
      this.props.userChangeValue(this.props.question_idx, this.props.question_identifier, new_values);
      this.props.apiAutoSave();
    }

    handleClick(e) {
      alert(
        "There's been an error. Don't worry, no data was lost. " +
          "Please let stein know that `QuestionValueSelector.handleClick` threw an error"
      );
    }

    render() {
      return (
        <div className="coding-form-question-value-selector" onClick={this.handleClick}>
          <div>
            {this.props.values.map((val, i) => {
              var disp_val, save_val;
              if (typeof val == "string") {
                disp_val = undefined;
                save_val = val;
              } else if (typeof val == "object") {
                disp_val = val.label;
                save_val = val.value;
              }
              return (
                <QuestionCheckbox
                  key={i}
                  display={disp_val}
                  value={save_val}
                  question_idx={this.props.question_idx}
                  question_identifier={this.props.question_identifier}
                  toggle={this.toggle}
                />
              );
            })}
            <OtherField setter={this.otherChanged} />
          </div>
        </div>
      );
    }
  }
);
