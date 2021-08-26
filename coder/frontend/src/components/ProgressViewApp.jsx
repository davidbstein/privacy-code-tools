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

/**
 * @param {number} progress the progress, as a number between 0 and 1
 * @param {String} text the text to display
 * @returns {object} a JSX div containing the text with a progress bar behind it
 */
function _progress_bar_below_text(progress, text) {
  const progress_bar_width = progress * 100;
  return (
    <div className="progress-bar-below-text">
      <div className="progress-bar-text">{text}</div>
      <div className="progress-bar" style={{ width: progress_bar_width + "%" }}></div>
    </div>
  );
}

function _coder_progress_display_function(policy_coding_infos, idx) {
  console.log(
    `policy_coding_infos - ${JSON.stringify(policy_coding_infos)} ${policy_coding_infos ? 1 : 0}`
  );
  console.log(`idx - ${idx}`);
  return _progress_bar_below_text(
    policy_coding_infos[idx].progress / 65,
    policy_coding_infos[idx].coder
  );
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
        display_fn: (policy) => policy.progress.loaded?.status ?? "👉 Pending",
      },
      {
        name: "coder 1",
        display_fn: (policy) =>
          policy.progress.codings?.[0] != undefined
            ? _coder_progress_display_function(policy.progress.codings, 0)
            : "unassigned",
        sort_fn: (policy) => policy.progress.codings?.[0]?.progress,
      },
      {
        name: "coder 2",
        display_fn: (policy) =>
          policy.progress.codings?.[1] != undefined
            ? _coder_progress_display_function(policy.progress.codings, 1)
            : "unassigned",
        sort_fn: (policy) => policy.progress.codings?.[1]?.progress,
      },
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
