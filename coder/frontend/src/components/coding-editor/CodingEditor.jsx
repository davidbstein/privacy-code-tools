import React, { Component } from "react";
import { connect } from "react-redux";
import { apiSaveCoding } from "src/actions/api";
import mapStateToProps from "src/components/utils/mapStateToProps";

class CodingEditor extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div> hi </div>;
  }
}

export default connect(mapStateToProps, { apiSaveCoding })(CodingEditor);
