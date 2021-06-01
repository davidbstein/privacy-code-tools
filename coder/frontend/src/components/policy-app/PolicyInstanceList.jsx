import React, { useState } from "react";
import Logger from "src/Logger";
import DocumentPreview from "src/components/policy-app/DocumentPreview";
const log = Logger("policy-admin", "blue");

function CodingInstanceList({ coding_instances }) {
  if (!coding_instances?.length) {
    return <div> no one has started coding these snapshots </div>;
  }
  return <div></div>;
}

export default function PolicyInstanceList({ policy_instances, coding_instances }) {
  return (
    <div id="policy-instance-list">
      {_.toPairs(policy_instances).map(([id, { content: document_list, policy_id, scan_dt }]) => (
        <div key={id}>
          <h1>Snapshot Taken on {new Date(scan_dt).toLocaleDateString()}</h1>
          <CodingInstanceList coding_instances={coding_instances} />
          <h2>documents</h2>
          {document_list.map(DocumentPreview)}
        </div>
      ))}
    </div>
  );
}
