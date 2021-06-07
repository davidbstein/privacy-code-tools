import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";
import Heading from "src/components/widgets/Heading";
import Loading from "src/components/widgets/Loading";
import SortableTable from "src/components/widgets/SortableTable";

/**
 * @typedef PolicyAssignmentEntry
 */

/**
 * @typedef Policy
 * @property {string} company_name
 * @property {string} site_name
 * @property {number} alexa_rank
 * @property {number} alexa_rank_US
 * @property {string[]} categories
 * @property {Object} meta
 * @property {string} locale
 * @property {object} progress
 * @property {PolicyAssignmentEntry} progress.loaded
 * @property {PolicyAssignmentEntry} progress.coding_1
 * @property {PolicyAssignmentEntry} progress.coding_2
 * @property {PolicyAssignmentEntry} progress.merged
 * @property {PolicyAssignmentEntry} progress.coded_2020
 * @property {PolicyAssignmentEntry} progress.coded_2018
 */

function _complete_test(progress) {
  return progress?.duplicate || _.toPairs(progress.merged).length || progress.coded_2020
    ? true
    : false; // replace "false" with completeness test
}

function _default_progress() {
  return {
    loaded: 0,
    coding_1: 0,
    coding_2: 0,
    merged: 0,
    coded_2020: 0,
    coded_2018: 0,
    duplicate: false,
    count: 0,
    complete: 0,
  };
}

function _policies_to_category_progress(policies) {
  const to_ret = {};
  for (let { categories, progress } of _.values(policies)) {
    for (let category of categories) {
      to_ret[category] ?? (to_ret[category] = _default_progress());
      for (let field in to_ret[category]) {
        to_ret[category][field] += progress[field]?.status == "complete";
      }
      to_ret[category].count++;
      to_ret[category].complete += _complete_test(progress) ? 1 : 0;
    }
  }
  return _.toPairs(to_ret).map(([k, v]) => ({ ...v, category: k }));
}

function _policies_to_coder_progress(policies) {
  const to_ret = {};
  for (let {
    progress: { coding_1, coding_2 },
  } of _.values(policies)) {
    for (let { email, complete, questions_answered } of [coding_1, coding_2]) {
      if (!email) continue;
      to_ret[email] ?? (to_ret[email] = { assigned: 0, complete: 0, questions_answered: 0 });
      to_ret[email].assigned++;
      to_ret[email].complete += complete ?? 0;
      to_ret[email].questions_answered += questions_answered ?? 0;
    }
  }
  return _.toPairs(to_ret).map(([k, v]) => ({ ...v, email: k }));
}

class ProgressViewApp extends Component {
  constructor(props) {
    super(props);
    this.props.apiGetPolicies();
  }

  render() {
    const _CODER_COLUMNS = [
      { name: "coder", display_fn: (coder) => coder.email },
      { name: "assigned", display_fn: (coder) => coder.assigned },
      { name: "complete", display_fn: (coder) => coder.complete },
      { name: "questions_answered", display_fn: (coder) => coder.questions_answered },
    ];
    const _OVERVIEW_COLUMNS = [
      { name: "category", display_fn: (policy) => policy.category },
      { name: "loaded", display_fn: (policy) => policy.loaded },
      { name: "coding_1", display_fn: (policy) => policy.coding_1 },
      { name: "coding_2", display_fn: (policy) => policy.coding_2 },
      { name: "merged", display_fn: (policy) => policy.merged },
      { name: "count", display_fn: (policy) => policy.count },
      { name: "complete", display_fn: (policy) => policy.complete },
    ];
    const _POLICY_COLUMNS = [
      {
        name: "Site",
        display_fn: (policy) => (
          <a href={`/c/${project_prefix}/policy/${policy.id}`}>{policy.site_name}</a>
        ),
        sort_fn: (policy) => policy.site_name,
      },
      {
        name: "Categories",
        display_fn: (policy) => (
          <div>
            {policy.categories.map((cat, i) => (
              <span key={i} className="site-category">
                {cat}
              </span>
            ))}
          </div>
        ),
        sort_fn: (policy) => JSON.stringify(policy.categories),
      },
      {
        name: "policy downloaded",
        display_fn: (policy) => policy.progress.loaded?.status ?? "👉 . Stein",
      },
      { name: "coder 1", display_fn: (policy) => policy.progress.coding_1?.email ?? "unassigned" },
      { name: "coder 2", display_fn: (policy) => policy.progress.coding_2?.email ?? "unassigned" },
      { name: "merged", display_fn: (policy) => "🔜" },
      {
        name: "coded_2018",
        display_fn: (policy) => (policy.progress.coded_2018 ? "✅" : ""),
      },
      {
        name: "coded_2020",
        display_fn: (policy) => (policy.progress.coded_2020 ? "✅" : ""),
      },
      {
        name: "complete",
        display_fn: (policy) => (_complete_test(policy.progress) ? "✅" : ""),
      },
    ];

    const {
      model: { policies },
      match: {
        params: { project_prefix },
      },
    } = this.props;
    if (_.isEmpty(policies)) return <Loading />;
    return (
      <div id="progress-view" className="page-root">
        <Heading title={`Project Status`} project_prefix={project_prefix} />
        <div id="project-progress-container" className="page-container">
          <SortableTable items={_policies_to_coder_progress(policies)} columns={_CODER_COLUMNS} />
          <SortableTable
            items={_policies_to_category_progress(policies)}
            columns={_OVERVIEW_COLUMNS}
          />
          <SortableTable items={_.values(policies)} columns={_POLICY_COLUMNS} />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProgressViewApp);
