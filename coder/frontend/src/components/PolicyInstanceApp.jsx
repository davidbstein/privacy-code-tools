import React, { Component } from "react";
import { connect } from "react-redux";
import { apiGetCoding } from "src/actions/api";

class PolicyInstanceApp extends Component {
  constructor(props) {
    super(props);
    // do stuff
  }

  render() {
    return (
      <div id="demo-container">
        <div id="demo-box">
          <h1> Hello! </h1>
          <div>
            you are logged in as: {CURRENT_USER}. <br />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  model: state.model,
});

export default connect(mapStateToProps, { apiGetCoding })(PolicyInstanceApp);
