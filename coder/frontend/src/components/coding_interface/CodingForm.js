import React, { Component } from 'react';
import { connect } from 'react-redux';
import { userSelectQuestion, userChangeValue, userClickSave } from '../../actions/userActions';


const mapStateToProps = state => ({
  model: state.model,
  localState: state.localState
});


const QuestionValueSelector = connect(
  mapStateToProps,
  {userChangeValue} // functions
)(
  class extends Component {
    constructor(props, context){
      super(props);
      this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
      console.log("value selection stuff.")
    }

    render() {
      return <div
        className="coding-form-question-value-selector"
        onClick={this.handleClick}
      >
        TODO: select one of {JSON.stringify(this.props.values)} for question {this.props.question_idx}
      </div>
    }
  }
)

const QuestionBox = connect(
  mapStateToProps,
  { userSelectQuestion } // functions
)(
  class extends Component {
    constructor(props, context){
      super(props);
      this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
      this.props.userSelectQuestion(this.props.idx)
    }

    render() {
      return <div className="coding-form-question-container">
        <div
          className={"coding-form-question" + (this.props.idx == this.props.localState.selectedQuestion ? " active-question" : "")}
          onClick={this.handleClick}
        >
          <div className="coding-form-question-title">
            {this.props.content.question}
          </div>
          <div className="coding-form-question-info">
            {this.props.content.info}
          </div>
          <QuestionValueSelector
            values={this.props.content.values}
            question_idx={this.props.idx}
          />
          <textarea/>
        </div>
      </div>
    }
  }
)



class CodingForm extends Component {
  render() {
    const coding = this.props.model.codings[this.props.coding_id];
    if (coding == undefined) {
      return <div className="coding-form-container">
        loading...
      </div>
    }
    return (
      <div className="coding-form-container">
        {coding.questions.map( (question_content, i) => {
          return <QuestionBox key={i}
            idx={i}
            content={question_content}
          />
        }
        )}
        <div className="coding-form-button-container">
          <button onClick={this.props.userClickSave}> Save! </button>
        </div>
      </div>
    );
  }
}


export default connect(
  mapStateToProps,
  { userClickSave } // functions
)(CodingForm);
