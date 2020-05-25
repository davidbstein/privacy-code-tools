import React, { Component } from 'react';
import { connect } from 'react-redux';
import { apiGetPolicy, apiGetPolicyInstance, apiGetCoding } from '../actions/api';
import CodingForm from './coding_interface/CodingForm'
import PolicyBrowser from './coding_interface/PolicyBrowser'


class CodingInterfaceApp extends Component {
  constructor(props) {
    super(props);
    this.props.apiGetPolicyInstance(this.props.policy_instance_id);
    this.props.apiGetCoding(this.props.coding_id);
  }

  render() {
    return (
      <div className="container">
        <PolicyBrowser policy_instance_id={this.props.policy_instance_id} />
        <CodingForm coding_id={this.props.coding_id} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  model: state.model
});

export default connect(
  mapStateToProps,
  { apiGetPolicy, apiGetPolicyInstance, apiGetCoding }
)(CodingInterfaceApp);
