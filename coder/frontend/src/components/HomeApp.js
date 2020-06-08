import React, { Component } from 'react';
import { connect } from 'react-redux';
import { apiGetCoding } from '../actions/api';

class HomeApp extends Component {
  constructor(props) {
    super(props);
    // do stuff
  }

  render() {
    return <div id='demo-container'><div id='demo-box'>
      <h1> privacy policy coding tools </h1>
      <div> If there are already saved codings stored for {CURRENT_USER}, those codings will be loaded. </div>
      </div>
    </div>
  }
}

const mapStateToProps = state => ({
  model: state.model
});

export default connect(
  mapStateToProps,
  { apiGetCoding }
)(HomeApp);
