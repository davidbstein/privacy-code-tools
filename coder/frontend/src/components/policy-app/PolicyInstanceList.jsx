import React, { Component } from "react";
import { connect } from "react-redux";
import DocumentPreview from "src/components/policy-app/DocumentPreview";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";
import SortableTable from "src/components/widgets/SortableTable";
import PolicyInstanceDocumentEntry from "src/components/policy-app/PolicyInstanceDocumentEntry";
import Logger from "src/Logger";
const log = Logger("policy-admin", "blue");

const CodingInstanceList = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class CodingInstanceList extends Component {
    constructor(props) {
      super(props);
      this.props.apiGetAllCodingInstances(this.props.policy_instance_id);
    }
    render() {
      const { coding_instances } = this.props;
      if (!coding_instances) {
        return <div> no one has started coding these snapshots </div>;
      }
      const _COLUMNS = [
        {
          name: "coder email",
          display_fn: (coding_instance) => coding_instance.coder_email,
          sort_fn: (coding_instance) => coding_instance.coder_email,
        },
        {
          name: "progress",
          display_fn: (coding_instance) =>
            `${
              _.values(coding_instance.coding_values).filter((value) => value.confidence).length
            } answers`,
          sort_fn: (coding_instance) =>
            _.values(coding_instance.coding_values).filter((value) => value.confidence).length,
        },
      ];
      return <SortableTable items={_.values(coding_instances)} columns={_COLUMNS} />;
    }
  }
);

class PolicyInstanceList extends Component {
  constructor(props) {
    super(props);
    this.createNewSnapshot = this.createNewSnapshot.bind(this);
  }
  createNewSnapshot() {
    this.props.apiPostPolicyInstance(this.props.policy_id);
  }
  render() {
    const { policy_instances, coding_instances, model: {project: {prefix, settings: {default_coding}}} } = this.props;
    return (
      <div id="policy-instance-list">
        {_.toPairs(policy_instances).map(([idx, { id, content: document_list, scan_dt }]) => (
          <div key={id}>
            <h1>
              Snapshot Taken on {new Date(scan_dt).toLocaleDateString()} (policy snapshot id: {id})
            </h1>
            <div id="policy-snapshot-start-coding-button">
              <a href={`/c/${prefix}/code-document/${id}/${default_coding}`}> Start Coding! </a>
            </div>
            <CodingInstanceList policy_instance_id={id} coding_instances={coding_instances} />
            <h2>documents</h2>
            {document_list.map((doc) => (
              <DocumentPreview
                key={doc.ordinal}
                title={doc.title}
                ordinal={doc.ordinal}
                content={doc.content}
              />
            ))}
            <PolicyInstanceDocumentEntry policy_instance_id={id} />
          </div>
        ))}
        <button id="create-snapshot-button" onClick={this.createNewSnapshot}>
          Create New Snapshot
        </button>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PolicyInstanceList);
