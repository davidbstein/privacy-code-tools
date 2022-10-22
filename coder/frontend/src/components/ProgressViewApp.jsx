import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { PROJECT_NAME } from "src/constants";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";
import Heading from "src/components/widgets/Heading";
import Loading from "src/components/widgets/Loading";
import SortableTable from "src/components/widgets/SortableTable";
import withParams from "src/components/utils/withParams";

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

// /**
//  * @param {number} progress the progress, as a number between 0 and 1
//  * @param {String} text the text to display
//  * @returns {object} a JSX div containing the text with a progress bar behind it
//  */
// function _progress_bar_below_text(progress, text) {
//   const progress_bar_width = progress * 100;
//   return (
//     <div className="progress-bar-below-text">
//       <div className="progress-bar-text">{text}</div>
//       <div className="progress-bar" style={{ width: progress_bar_width + "%" }}></div>
//     </div>
//   );
// }

// function _coder_progress_display_function(policy_coding_infos, idx) {
//   console.log(
//     `policy_coding_infos - ${JSON.stringify(policy_coding_infos)} ${policy_coding_infos ? 1 : 0}`
//   );
//   console.log(`idx - ${idx}`);
//   return _progress_bar_below_text(
//     policy_coding_infos[idx].progress / 65,
//     policy_coding_infos[idx].coder
//   );
// }


class ProgressViewApp extends Component {
  constructor(props) {
    super(props);
    this.props.apiGetPolicies();
  }

  render() {
    const {
      model: { 
        policies,
        project: { settings },
      },
      match: {
        params: { project_prefix },
      },
    } = this.props;
    const default_coding = settings?.default_coding || 8;

    const _CODER_COLUMNS = [
      { name: "coder", display_fn: (coder) => coder.email },
      { name: "assigned", display_fn: (coder) => coder.assigned },
      { name: "complete", display_fn: (coder) => coder.complete },
      { name: "questions_answered", display_fn: (coder) => coder.questions_answered },
    ];
    const _OVERVIEW_COLUMNS = [
      { name: "category", display_fn: (policy) => policy.category },
      { name: "loaded", display_fn: (policy) => policy.loaded },
      { name: "codings", display_fn: (policy) => "TODO" },
      { name: "merged", display_fn: (policy) => policy.merged },
      { name: "count", display_fn: (policy) => policy.count },
      { name: "complete", display_fn: (policy) => policy.complete },
    ];
    const _POLICY_COLUMNS = [
      // {
      //   name: "Document Collection",
      //   display_fn: (policy) => (
      //     <a href={`/c/${project_prefix}/policy/${policy.id}`}>{policy.company_name}</a>
      //   ),
      //   sort_fn: (policy) => policy.company_name,
      // },
      // {
      //   name: "Categories",
      //   display_fn: (policy) => (
      //     <div>
      //       {policy.categories.map((cat, i) => (
      //         <span key={i} className="site-category">
      //           {cat}
      //         </span>
      //       ))}
      //     </div>
      //   ),
      //   sort_fn: (policy) => JSON.stringify(policy.categories),
      // },
      { 
        name: "Policy", display_fn: (policy) => policy.site_name 
      }, {
        name: "Docs Loaded",
        display_fn: (policy) => policy.progress.loaded?.status ?? "👉 Pending",
        sort_fn: (policy) => policy.progress.loaded?.status ?? -1,
      }, { 
        name: "Coders Done", 
        display_fn: (policy) => policy.progress.coded < 2 ? ["❌","🔄"][policy.progress.coded] : "✅ ",
        sort_fn: (policy) => `${policy.progress.reviewed} - ${9-policy.progress.coded}`,
        completed_fn: (policy) => policy.progress.coded >= 2
      }, { 
        name: "Fully Reviewed", 
        display_fn: (policy) => policy.progress.reviewed == 0 ? (policy.progress.coded < 2 ? "":"🔄") : "✅ ", 
        sort_fn: (policy) => `${policy.progress.reviewed} - ${9-policy.progress.coded}`,
        completed_fn: (policy) => policy.progress.reviewed >= 1
      }, { 
        name: "links", 
        display_fn: (policy) => (
          <div>
            <a href={`/c/${PROJECT_NAME}/code-policy/${policy.progress.coding_link}/${default_coding}`}>Code</a> | 
            <a href={`/c/${PROJECT_NAME}/code-merge/${policy.progress.coding_link}/${default_coding}`}>Review</a>
          </div>
        )
      },
    ];
    if (policies._unloaded) return <Loading />;
    const polArray = _.valuesIn(policies);
    return (
      <div id="progress-view" className="page-root">
        <Heading title={`Project Status`} project_prefix={project_prefix} />
        <div id="project-progress-container" className="page-container">
        <div id="progress-bars">
          {_POLICY_COLUMNS.map(({name, display_fn, sort_fn, completed_fn}, idx) => {
            if (completed_fn) {
              const total = polArray.length;
              const completed = _.filter(polArray, completed_fn).length;
              return (
                <div className="progress-bar-below-text" key={idx}>
                  <div className="progress-bar-text">{name} - {completed}/{total}</div>
                  <div className="progress-bar" style={{ width: (completed / total) * 100 + "%" }}></div>
                </div>
              );              
            } else {
              return "";
            }
          })}
        </div>
        <SortableTable items={_.values(policies)} columns={_POLICY_COLUMNS} sortColumnIdx={3} />
        </div>
      </div>
    );
  }
}

export default withParams(connect(mapStateToProps, mapDispatchToProps)(ProgressViewApp));
