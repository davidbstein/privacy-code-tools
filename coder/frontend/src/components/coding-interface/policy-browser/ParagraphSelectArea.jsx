import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class ParagraphSelectArea extends Component {
    constructor(props, context) {
      super(props);
      this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
      this.props.userToggleParagraph(this.props.doc.ordinal, this.props.idx);
      this.props.apiAutoSave();
    }
    render() {
      const { idx, doc } = this.props;
      return <div className="highlight-paragraph" onClick={this.handleClick} />;
    }
  }
);
