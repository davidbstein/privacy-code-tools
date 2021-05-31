import React, { Component } from "react";
import { connect } from "react-redux";
import { apiGetPolicies } from "src/actions/api";
import PolicyList from "src/components/policy-app/PolicyList";
import mapStateToProps from "src/components/utils/mapStateToProps";
import model from "src/reducers/model";
import Loading from "src/components/widgets/Loading";
import Heading from "src/components/widgets/Heading";
import PolicyAdminOverview from "src/components/policy-app/PolicyAdminOverview";

class PolicyApp extends Component {
  constructor(props) {
    super(props);
    // do stuff
    this.props.apiGetPolicies();
  }

  render() {
    const {
      model: {
        policies,
        project: { project_settings },
      },
      match: {
        params: { policy_id = undefined, project_prefix },
      },
    } = this.props;
    if (_.isEmpty(policies) || _.isEmpty(project_settings)) return <Loading />;

    return (
      <div id="policy-admin" className="page-root">
        <Heading title="Policy Admin Panel" project_prefix={project_prefix} />
        <div id="policy-admin-container">
          {policy_id ? <PolicyAdminOverview /> : <PolicyList policies={policies} />}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, { apiGetPolicies })(PolicyApp);
