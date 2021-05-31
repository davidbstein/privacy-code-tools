import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import mapStateToProps from "src/components/utils/mapStateToProps";
import SortableTable from "src/components/widgets/SortableTable";

/**
 * @param {object} params
 * @param {Policy[]} params.policies
 * @returns
 */
class PolicyList extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      policies,
      model: { project_settings },
      project_prefix,
    } = this.props;
    const _COLUMNS = [
      {
        name: "view details",
        display_fn: (policy) => <a href={`/c/${project_prefix}/policy/${policy.id}`}>link</a>,
        sort_fn: (policy) => policy.id,
      },
      {
        name: "Global Rank",
        display_fn: (policy) => `${policy.alexa_rank}`,
        sort_fn: (policy) => policy.alexa_rank,
      },
      {
        name: "US Rank",
        display_fn: (policy) => `${policy.alexa_rank_US || "--"}`,
        sort_fn: (policy) => policy.alexa_rank_US,
      },
      {
        name: "site",
        display_fn: (policy) => `${policy.site_name}`,
        sort_fn: (policy) => policy.site_name,
      },
      {
        name: "registered name",
        display_fn: (policy) => `${policy.company_name}`,
        sort_fn: (policy) => policy.company_name,
      },
      {
        name: "language",
        display_fn: (policy) => `${policy.locale}`,
        sort_fn: (policy) => policy.locale,
      },
      {
        name: "policy snapshot taken",
        display_fn: (policy) => `TODO`,
        sort_fn: (policy) => 1,
      },
      {
        name: "coding progress",
        display_fn: (policy) => `TODO`,
        sort_fn: (policy) => 1,
      },
      {
        name: "review progress",
        display_fn: (policy) => `TODO`,
        sort_fn: (policy) => 1,
      },
      {
        name: "(self-reported) adult content",
        display_fn: (policy) =>
          policy.meta.contentdata.adultcontent == "yes" ? (
            <span className="adult-yes">yes</span>
          ) : policy.meta.contentdata.adultcontent == "no" ? (
            <span className="adult-no">no</span>
          ) : (
            <span className="adult-maybe">unlabeled</span>
          ),
        sort_fn: (policy) => policy.meta.contentdata.adultcontent,
      },
    ];

    return (
      <div id="policies-table-container">
        <h1> Websites to code </h1>
        <div className="info-box">
          {" "}
          Follow the links below to:{" "}
          <ul>
            <li>view website details downloaded from Alexa</li>{" "}
            <li>view policy snapshots and download new snapshots</li>{" "}
            <li>assign coders to policies and view progress</li>
            <li>or merge completed codings</li>
          </ul>
        </div>
        <SortableTable id="policies-list-table" items={_.values(policies)} columns={_COLUMNS} />
      </div>
    );
  }
}
export default connect(mapStateToProps, {})(PolicyList);
