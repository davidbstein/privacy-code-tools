import React, { Component } from "react";
import { connect } from "react-redux";
import QuestionBox from "src/components/coding-interface/coding-form/QuestionBox";
import { randomColor } from "src/components/utils/displayUtils";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class CodingCategory extends Component {
    constructor(props, context) {
      super(props, context);
    }
    render() {
      const {
        category: { id, label, notes, questions },
      } = this.props;
      let counter = 0;
      return (
        <div className="coding-container" style={{ backgroundColor: randomColor(label, 30, 80) }}>
          <h1>{label}</h1>
          {questions.map((question_content, i) => (
            <QuestionBox
              key={"question-box-" + i}
              count={++counter}
              category_id={this.props.idx /** TODO: CATEGORIES SHOULD HAVE IDs */}
              category_label={label}
              content={question_content}
            />
          ))}
        </div>
      );
    }
  }
);
