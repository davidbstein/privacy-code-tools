import React, { Component } from "react";
import { connect } from "react-redux";
import { apiGetCoding } from "src/actions/api";
import mapStateToProps from "src/components/utils/mapStateToProps";

class PolicyApp extends Component {
  constructor(props) {
    super(props);
    // do stuff
  }

  render() {
    return (
      <div id="demo-container">
        <div id="demo-box">
          <h1> Hello! </h1>
          <div className="login-message-thingy">
            you are logged in as: {CURRENT_USER}. <br />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, { apiGetCoding })(PolicyApp);
