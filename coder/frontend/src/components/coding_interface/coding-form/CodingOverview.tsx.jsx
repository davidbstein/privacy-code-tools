import React, { Component } from "react";
import { connect } from "react-redux";
import { CURRENT_USER } from "src/constants";

const mapStateToProps = (state) => ({
  model: state.model,
  localState: state.localState,
});

export default connect(
  mapStateToProps,
  {}
)(
  class CodingOverview extends Component {
    render() {
      if (!true) {
        return <div />;
      }
      return (
        <div className="policy-browser-overview">
          <h1> Coding </h1>
          <div>
            {" "}
            Coding will be attributed to <b>{CURRENT_USER}</b>{" "}
          </div>
          <div>
            This form will auto-save. You can also press <code>ctrl+s</code> (windows), <code>⌘+s</code>
            (mac), or hit the "save" button at the bottom of this form.
          </div>
        </div>
      );
    }
  }
);
