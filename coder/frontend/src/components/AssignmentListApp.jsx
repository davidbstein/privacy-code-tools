import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { apiGetAssignments } from "src/actions/api";
import Loading from "src/components/widgets/Loading";
import _ from "lodash";

/**
 * @param {object} params
 * @param {object[]} params.assignments
 * @param {number} params.assignments[].id
 * @param {String} params.assignments[].created_dt
 * @param {String} params.assignments[].coder_email
 * @param {String} params.assignments[].url
 * @param {String} params.assignments[].label
 * @param {object} params.assignments[].notes
 * @param {String} params.assignments[].due_dt
 * @param {String} params.assignments[].completed_dt
 * @param {String} params.assignments[].type
 * @param {String} params.assignments[].status
 * @returns
 */
function SortableAssignmentTable({ assignments = [] }) {
  const [sortKey, setSortKey] = useState("due date");
  return (
    <table id="assignment-list-table">
      <thead>
        <tr>
          {["assignment", "created", "due date", "progress"].map((column_name) => (
            <th
              onClick={() => setSortKey(column_name)}
              key={column_name}
              className={column_name == sortKey ? "selected" : ""}
            >
              {column_name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {_.map(assignments, (assignment) => (
          <tr key={assignment.id}>
            <td>
              <a href={assignment.url}>{assignment.label}</a>
            </td>
            <td>{new Date(assignment.created_dt).toDateString()}</td>
            <td>{new Date(assignment.due_dt).toDateString()}</td>
            <td>coming soon</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

class AssignmentListApp extends Component {
  constructor(props) {
    super(props);
    this.props.apiGetAssignments();
    // do stuff
  }

  render() {
    const {
      model: { assignments },
      match: {
        params: { coder_email = undefined, project_id },
      },
    } = this.props;
    if (_.isEmpty(assignments)) return <Loading />;
    const coder_assignments = _.groupBy(assignments, "coder_email");
    return (
      <div id="assignment-list">
        <div id="title">
          <div>
            <h1> Assignments for {coder_email || "everyone"}</h1>
          </div>
          <div>
            <a href={`/c/${project_id}`}>home</a> <a href="/account/logout">logout</a>
          </div>
        </div>
        <div id="contents">
          {coder_email ? (
            <SortableAssignmentTable assignments={coder_assignments[coder_email]} />
          ) : (
            _.map(coder_assignments, (coder_assignments, coder) => (
              <div className="coder-assignments" key={coder}>
                <h2>{coder}</h2>
                <SortableAssignmentTable assignments={coder_assignments} />
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  model: state.model,
});

export default connect(mapStateToProps, { apiGetAssignments })(AssignmentListApp);
