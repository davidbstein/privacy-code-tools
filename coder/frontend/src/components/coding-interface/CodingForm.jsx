/**
 * A CodingForm is one of the two panes shown to coders. It shows the questions and provides
 * nagivation tools for hopping around the questions.
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import CodingOverview from "src/components/coding-interface/coding-form/CodingOverview";
import CodingCategory from "src/components/coding-interface/coding-form/CodingCategory";
import FloatingControls from "src/components/coding-interface/coding-form/FloatingControls";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class CodingForm extends Component {
    constructor(props, context) {
      super(props, context);
      this.userSave = this.userSave.bind(this);
      this.userSubmit = this.userSubmit.bind(this);
      this.localStore = this.localStore.bind(this);
      this.restoreStore = this.restoreStore.bind(this);
    }
    fun() {
      alert("whee 🤓");
    }
    userSave() {
      this.props.apiPostCodingInstance(
        this.props.policy_instance_id,
        this.props.coding_id,
        this.props.localState.localCodingInstance
      );
    }
    userSubmit() {
      this.props.apiPostCodingInstance(
        this.props.policy_instance_id,
        this.props.coding_id,
        this.props.localState.localCodingInstance
      );
      3;
      window.location.assign(`/c/${this.props.model.project.prefix}/`);
    }
    localStore() {
      window.localStorage.setItem(
        location.pathname,
        JSON.stringify(this.props.localState.localCodingInstance)
      );
      alert("The current state of this page has been saved to your browser's memory.");
    }
    restoreStore() {
      const warning_msg =
        "This will revert to the last time you clicked 'offline save' on this computer." +
        "\n\nAnything you've done since then (on any computer) will be lost forever. \n\ncontinue?";
      if (!window.confirm(warning_msg)) return;
      this.props.localState.localCodingInstance = JSON.parse(
        window.localStorage.getItem(window.location.pathname)
      );
      this.props.userNullOp();
    }
    render() {
      const { coding_id } = this.props;
      const coding = this.props.model?.codings[coding_id];
      if (!coding || !coding?.categories) {
        return <div className="coding-form-pane">loading...</div>;
      }
      var counter = 0;
      return (
        <div className="coding-form-pane">
          <CodingOverview coding={coding} />
          <div className="coding-form-container">
            {coding.categories.map((category, i) => (
              <CodingCategory category={category} idx={i} key={i} />
            ))}
            <div className="coding-form-button-container">
              <button onClick={this.userSave} className="coding-form-submit-button">
                Save
              </button>
              <button onClick={this.userSubmit} className="coding-form-submit-button">
                Save and return home
              </button>
              <button onClick={this.localStore} className="coding-form-submit-button">
                [danger!] Offline Save
              </button>
              <button onClick={this.restoreStore} className="coding-form-submit-button">
                [danger!] Restore Last Offline Save
              </button>
              <button onClick={this.fun} className="coding-form-submit-button">
                fun button
              </button>
            </div>
            <FloatingControls />
          </div>
        </div>
      );
    }
  }
);
