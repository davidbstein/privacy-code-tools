import React, { Component } from "react";
import _ from "lodash";
import PolicySentence from "./PolicySentence";
import { connect } from "react-redux";
import ParagraphSelectArea from "src/components/coding-interface/policy-browser/ParagraphSelectArea";
import mapStateToProps from "src/components/utils/mapStateToProps";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";

function SentenceList({ sentences, idxOffset = 0, paragraph_idx, doc }) {
  return sentences.map((sentence, idx) => (
    <PolicySentence
      idx={idx + idxOffset}
      key={idx}
      paragraph_idx={paragraph_idx}
      content={sentence}
      doc_ordinal={doc.ordinal}
    />
  ));
}

function SectionParagraph({ idx, doc, sectionCounter, paragraph: { content, level } }) {
  return (
    <div className={`paragraph-section level-${level}`}>
      <span className="section-num">[§{sectionCounter.get_next(level)}]</span>
      <SentenceList sentences={content} paragraph_idx={idx} doc={doc} />
    </div>
  );
}

function TextParagraph({ idx, doc, paragraph: { content } }) {
  return (
    <div className={`paragraph-text`}>
      <SentenceList sentences={content} paragraph_idx={idx} doc={doc} />
    </div>
  );
}

function ListParagraphItem({ paragraph_idx, doc, item: { depth, bullet, content }, idxOffset }) {
  const spacers = [];
  for (let __i = 0; __i <= depth; __i++) spacers.push(<div key={__i} className="bullet-spacer" />);
  return (
    <div className={`paragraph-list-item`}>
      {spacers}
      <div className="list-bullet">{bullet}</div>
      <div className="list-item-content">
        <SentenceList
          sentences={content}
          paragraph_idx={paragraph_idx}
          doc={doc}
          idxOffset={idxOffset}
        />
      </div>
    </div>
  );
}

function ListParagraph({ idx, doc, paragraph: { content } }) {
  return (
    <div className={`paragraph-list`}>
      {content.map((item, key) => (
        <ListParagraphItem
          paragraph_idx={idx}
          item={item}
          idxOffset={_.sum(content.slice(0, key).map((li) => li.content.length))}
          doc={doc}
          key={key}
        />
      ))}
    </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class PolicyParagraph extends Component {
    constructor(props) {
      super(props);
      this.checkSelected = this.checkSelected.bind(this);
    }
    checkSelected(key) {
      return (
        this.props.localState.localCodingInstance.categoryHighlights?.[
          this.props.localState.selectedCategoryIdentifier
        ]?.[key] == true
      );
    }
    render() {
      const { idx, paragraph, doc, sectionCounter } = this.props;
      const selected = this.checkSelected(`${doc.ordinal}-${idx}`);
      return (
        <div
          className={`policy-browser-paragraph selected-${selected}`}
          id={`paragraph-${doc.ordinal}-${idx}`}
        >
          <div className="policy-browser-paragraph-num">{idx + 1}</div>
          <div className="paragraph-content">
            {{
              section: SectionParagraph,
              text: TextParagraph,
              list: ListParagraph,
            }[paragraph.type]({ idx, paragraph, doc, sectionCounter })}
          </div>
          <div className={`policy-paragraph-select`}>
            <ParagraphSelectArea idx={idx} doc={doc} />
          </div>
        </div>
      );
    }
  }
);
