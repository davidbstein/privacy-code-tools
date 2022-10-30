import React, { Component } from "react";
import { connect } from "react-redux";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";
import withParams from "src/components/utils/withParams";
import { CURRENT_USER } from "src/constants";

import Heading from "src/components/widgets/Heading";
import Loading from "src/components/widgets/Loading";
import SortableTable from "src/components/widgets/SortableTable";

function get_all_answers(coding, coding_instances) {
  return {};
}

class PolicyApp extends Component {
  constructor(props) {
    super(props);
    this.props.apiGetReport();
    this.props.apiGetPolicies();
    this.props.apiGetCoding();
  }
  render() {
    const {
      model: {
        policies,
        report,
        project: { settings },
      },
      match: {
        params: { project_prefix },
      },
    } = this.props;
    if (report._unloaded) return <Loading />;
    const rows = report.map((row) => ({
      policy_id: row.policy,
      name: policies[row.policy].company_name,
      answers: row.answers,
    }));
    const _REPORT_COLUMNS = [
      {
        name: "Policy",
        display_fn: (row) => `${row.name}`,
      },
    ]
    return (
      <div id="data-exporer-view" className="page-root">
        <Heading title={`Data Explorer`} project_prefix={project_prefix} />

        <div id="data-explorer-container" className="page-container">
          <SortableTable items={_.values(rows)} columns={_REPORT_COLUMNS} sortColumnIdx={0} />
        </div>
      </div>
    )
  }
}
export default withParams(connect(mapStateToProps, mapDispatchToProps)(PolicyApp));
