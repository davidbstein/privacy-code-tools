/**
 * A CodingForm is one of the two panes shown to coders. It shows the questions and provides
 * nagivation tools for hopping around the questions.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  apiPostCodingInstance
} from '../../actions/api';
import {
  userNullOp
} from '../../actions/userActions';
import QuestionBox from "./coding-form/QuestionBox"
import FloatingControls from "./coding-form/FloatingControls"
import CodingOverview from "./coding-form/CodingOverview"
import BreakoutOption from "./coding-form/BreakoutOption"
import BreakoutHeader from "./coding-form/BreakoutHeader"

const mapStateToProps = state => ({
  model: state.model,
  localState: state.localState
});



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
