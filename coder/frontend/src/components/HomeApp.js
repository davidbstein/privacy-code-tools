import React, { Component } from 'react';
import { connect } from 'react-redux';
import { apiGetCoding } from 'src/actions/api';
import { useParams } from "react-router-dom";

const mapStateToProps = state => ({
  model: state.model,
  route: useParams()
});


class HomeApp extends Component {
  constructor(props) {
    super(props);
    // do stuff
  }

  render() {
    return (
      <div id='demo-container'>
        <div id='demo-box'>
        <h1> Hello! </h1>
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  { apiGetCoding }
)(HomeApp);
