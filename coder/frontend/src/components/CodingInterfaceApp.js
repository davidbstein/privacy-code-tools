// @ts-ignore
import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import CodingForm from "src/components/coding_interface/CodingForm";
import PolicyBrowser from "src/components/coding_interface/PolicyBrowser";
import { apiGetPolicyInstance, apiGetCoding, apiGetCodingInstance, apiGetAllCodingInstances } from "src/actions/api";
import { appSetCurrentView } from "src/actions/appActions";
import SessionTimer from "src/components/utils/SessionTimer";

const mapStateToProps = (state) => ({
  model: state.model,
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
    // @ts-ignore
    window.SESSION_TIMER = new SessionTimer(CURRENT_USER, this.props.coding_id, this.props.policy_instance_id);
    // @ts-ignore
    window.setInterval(_.throttle(window.SESSION_TIMER.post_update, 29 * 1000), 30 * 1000);
  }

  render() {
    return (
      <div className="container">
        <PolicyBrowser coding_id={this.props.coding_id} policy_instance_id={this.props.policy_instance_id} />
        <CodingForm coding_id={this.props.coding_id} policy_instance_id={this.props.policy_instance_id} />
      </div>
    );
  }
}

export default connect(mapStateToProps, {
  apiGetPolicyInstance,
  apiGetCoding,
  apiGetCodingInstance,
  appSetCurrentView,
  apiGetAllCodingInstances,
})(CodingInterfaceApp);
