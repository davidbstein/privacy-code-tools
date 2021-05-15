import React, { Component } from 'react';
import { connect } from 'react-redux';
import { apiGetCoding } from 'src/actions/api';
import PersonalProgressView from 'src/components/widgets/PersonalProgressView'

class CoderStatusApp extends Component {
  constructor(props) {
    super(props);
    // do stuff
  }

  render() {
    return <div id='demo-container'><div id='demo-box'>
      <h1> Hello! </h1>
      <PersonalProgressView coder_email={this.props}/>
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
)(CoderStatusApp);
