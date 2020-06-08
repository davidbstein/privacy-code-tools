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
      <h1> Hello! </h1>
      <div>
        you are logged in as: {CURRENT_USER}. <br />
        Data will be loaded shortly. <br />
        Check out <ul>
        <li><a href="/code-policy/20"> match.com </a></li>
        <li><a href="/code-policy/21"> 2018 Google archive </a></li>
        <li><a href="/code-policy/22"> 2018 Facebook archive </a></li>
        </ul>
      </div>
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
