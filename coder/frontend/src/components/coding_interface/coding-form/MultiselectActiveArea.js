



import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    userSelectQuestion
} from '../../../actions/userActions';
import {
    scrollToSentenceTarget, stringifySentences
} from '../../utils/displayUtils';
import {
    MergeTool
} from './MergeElements';
import QuestionValueCommentBox from './QuestionValueCommentBox';
import QuestionValueSelector from './QuestionValueSelector';





const mapStateToProps = state => ({
    model: state.model,
    localState: state.localState
  });
  

export default connect(
    mapStateToProps,
    { userSelectQuestion } // functions
  )(
    class MultiselectActiveArea extends Component {
      render() {
        return <div className={this.props.is_active ? "active-selection-area" : "inactive-selection-area"}>
          <hr/>
          <div className="question-box-wiki-link">
            <a href={`/wiki/questions/${this.props.content.identifier.replace(".", "_")}`} target="_blank"> View additional help on the question </a>
          </div>
          <div className="coding-form-question-info">
            {this.props.content.details || ""}
          </div>
            { this.props.localState.merge_mode ?
              <MergeTool
                question_idx={this.props.idx}
                question_identifier={this.props.content.identifier}
                mergeData={this.props.mergeData} /> : <div />
              }
          <div className="coding-form-sentence-list">
            {stringifySentences(this.props.sentences).map((s, i) => (
              <div
                key={i}
                onClick={scrollToSentenceTarget}
                className="sentence-index-button"
                target={`paragraph-${s.policy_type}-${s.paragraph_idx}`}>
                {s.pretty_string}
              </div>
              ))}
          </div>
          <QuestionValueSelector
            question_identifier={this.props.content.identifier}
            question_idx={this.props.idx}
            values={this.props.content.values}
            singleselect={['singleselect', 'breakout-option'].indexOf(this.props.content.type) > -1}
            />
          <QuestionValueCommentBox
            question_identifier={this.props.content.identifier}
            question_idx={this.props.idx}
            values={this.props.cur_question}
            />
        </div>
      }
    }
  )
  