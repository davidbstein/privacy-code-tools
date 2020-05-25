import React, { Component } from 'react';
import { connect } from 'react-redux';
import { apiGetCoding } from '../actions/api';

class MergeApp extends Component {
  constructor(props) {
    super(props);
    // do stuff
  }

  render() {
    return (
      <div> HOME APP </div>
    );
  }
}

const mapStateToProps = state => ({
  model: state.model
});

export default connect(
  mapStateToProps,
  { apiGetCoding }
)(MergeApp);
