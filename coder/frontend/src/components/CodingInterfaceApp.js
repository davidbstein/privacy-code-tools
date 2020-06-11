import React, { Component } from 'react';
import { connect } from 'react-redux';
import CodingForm from './coding_interface/CodingForm'
import PolicyBrowser from './coding_interface/PolicyBrowser'
import {
  apiGetPolicy,
  apiGetPolicyInstance,
  apiGetCoding,
  apiGetCodingInstance,
  apiGetAllCodingInstances,
} from '../actions/api';
import { appSetCurrentView } from '../actions/appActions'

const mapStateToProps = state => ({
  model: state.model
});

class CodingInterfaceApp extends Component {
  constructor(props) {
    super(props);
    this.props.apiGetPolicyInstance(this.props.policy_instance_id);
    this.props.apiGetCoding(this.props.coding_id);
    this.props.apiGetCodingInstance(this.props.policy_instance_id, this.props.coding_id);
    this.props.appSetCurrentView(this.props.policy_instance_id, this.props.coding_id, this.props.merge_mode);
    if (this.props.merge_mode) {
      this.props.apiGetAllCodingInstances(this.props.policy_instance_id, this.props.coding_id);
    }
  }

  render() {
    return (
      <div className="container">
        <PolicyBrowser
          coding_id={this.props.coding_id}
          policy_instance_id={this.props.policy_instance_id} />
        <CodingForm
          coding_id={this.props.coding_id}
          policy_instance_id={this.props.policy_instance_id} />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  { apiGetPolicy, apiGetPolicyInstance, apiGetCoding, apiGetCodingInstance, appSetCurrentView, apiGetAllCodingInstances }
)(CodingInterfaceApp);
