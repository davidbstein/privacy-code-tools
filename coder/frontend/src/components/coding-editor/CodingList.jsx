import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import mapStateToProps from "src/components/utils/mapStateToProps";
import SortableTable from "src/components/widgets/SortableTable";
import { apiUpdateProjectSettings } from "src/actions/api";
/**
 * @param {object} params
 * @param {Coding[]} params.codings
 * @returns
 */
class CodingList extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      codings,
      default_coding = 1,
      model: { project_settings },
      project_prefix,
      apiUpdateProjectSettings,
    } = this.props;
    const _COLUMNS = [
      {
        name: "Default",
        display_fn: (coding) => (
          <input
            type="checkbox"
            checked={coding.id == default_coding}
            onClick={() => {
              apiUpdateProjectSettings(project_prefix, { ...project_settings, default_coding: coding.id });
            }}
            readOnly={true}
          />
        ),
        sort_fn: (coding) => coding.id,
      },
      {
        name: "id",
        display_fn: (coding) => `${coding.id}`,
        sort_fn: (coding) => coding.id,
      },
      {
        name: "Link",
        display_fn: (coding) => <a href={`${coding.id}`}>edit this coding</a>,
        sort_fn: (coding) => coding.id,
      },
      {
        name: "created",
        display_fn: (coding) => new Date(coding.created_dt).toDateString(),
        sort_fn: (coding) => coding.created_dt,
      },
      {
        name: "questions",
        display_fn: (coding) => `I'm not sure how to count this yet`,
        sort_fn: (coding) => coding.questions.length,
      },
    ];

    return <SortableTable id="coding-list-table" items={_.values(codings)} columns={_COLUMNS} />;
  }
}
export default connect(mapStateToProps, { apiUpdateProjectSettings })(CodingList);
