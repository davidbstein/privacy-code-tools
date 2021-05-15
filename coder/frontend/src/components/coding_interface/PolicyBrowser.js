import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import PolicyPage from 'src/components/coding_interface/policy-browser/PolicyPage'
import PolicyOverview from 'src/components/coding_interface/policy-browser/PolicyOverview'

const mapStateToProps = state => ({
  model: state.model,
  localState: state.localState
});

export default connect(
  mapStateToProps,
  {  } // functions
)(
  class PolicyBrowser extends Component {
    componentDidMount() {
      const pbc = document.getElementById('policy-browser-container');
      pbc.onscroll = _.throttle(
        function(e){
          const headings = document.getElementsByClassName("policy-browser-section-container");
          const idx = _.sum(_.map(headings, (h) => pbc.scrollTop - h.offsetTop > 0)) - 1;
          for (var _i=0; _i < headings.length; _i++) {
            const h = headings[_i];
            if (_i === idx) {
              h.classList.add("active-policy");
            } else {
              h.classList.remove("active-policy");
            }
          }
        }.bind(this), 100, {leading: true}
      )
    }
    render() {
      const policy_instance = this.props.model.policy_instances[this.props.policy_instance_id];
      if (policy_instance == undefined) {
        return <div className="policy-browser-container" id="policy-browser-container">
          loading...
        </div>
      }
      const policy = (this.props.model.policies[policy_instance.policy_id] || {urls: {}});
      const robots = policy.urls._robot_rules ?
        <div className='robots'> <tt> <b> This is the site robots.txt file for the site, you can ignore it </b> <br/><pre>{policy.urls._robot_rules}</pre> </tt></div> :
        <div></div>
      const policy_pages = [];
      for (const policy_type of ['privacy_policy', 'tos', 'ccpa_policy', 'gdpr_policy', 'eu_privacy_policy', 'eu_privacy_policy', '_robot_rules']){
        const policy_content = policy_instance.content[policy_type];
        if (policy_content){
          policy_pages.push(<PolicyPage
            key={policy_type}
            coding_id={this.props.coding_id}
            policy_content={policy_content}
            policy_id={policy_instance.policy_id}
            policy_instance={policy_instance}
            policy_type={policy_type}
            />)
        }
      }
      return (
        <div className="policy-browser-container" id="policy-browser-container">
          <PolicyOverview
            policy_id={policy_instance.policy_id}
            policy_instance={policy_instance}
            content={policy_instance.content}/>
          {policy_pages}
          {robots}
        </div>
      );
    }
  }
);
