import React, { Component } from 'react';
import { connect } from 'react-redux';
import { userToggleSentence } from '../../actions/userActions';


const mapStateToProps = state => ({
  model: state.model,
  localState: state.localState
});


const PolicySentence = connect(
  mapStateToProps,
  {userToggleSentence}
)(
  class extends Component {
    constructor(props, context){
      super(props);
      this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
      this.props.userToggleSentence(
        this.props.paragraph_idx,
        this.props.idx
      )
    }

    render() {
      const selected_sentences = (this.props.localState.localCoding[this.props.localState.selectedQuestion] || {}).sentences;
      var extra_class = 'unselected'
      if (
        selected_sentences &&
        selected_sentences[this.props.paragraph_idx] &&
        (selected_sentences[this.props.paragraph_idx].indexOf(this.props.idx) >= 0))
        extra_class="selected"
      return <span
        className={"policy-browser-paragraph-sentence " + extra_class}
        onClick={this.handleClick}
      >
        {this.props.content}.
      </span>
    }
  }
)



class PolicyParagraph extends Component {
  render() {
    return <div className="policy-browser-paragraph">
      {this.props.content.map((sentence_content, i)=>
        <PolicySentence
          idx={i}
          key={i}
          paragraph_idx={this.props.idx}
          content={sentence_content}
          />
      )}
    </div>
  }
}


const PolicyOverview = connect(
  mapStateToProps,
  {userToggleSentence}
)(
  class extends Component {
    render() {
      const policy = this.props.model.policies[this.props.policy_id];
      if (!policy) {
        return <div />
      }
      return <div className="policy-browser-overview">
        <h1> {policy.company_name} </h1>
        <div> alexa rank: {policy.alexa_rank} </div>
        <div> policy type: {policy.policy_type} </div>
        <div> text retrieved from: <a href={policy.url}>{policy.url}</a> </div>
      </div>
    }
  }
)


class PolicyBrowser extends Component {
  render() {
    const policy_instance = this.props.model.policy_instances[this.props.policy_instance_id];
    if (policy_instance == undefined) {
      return <div className="policy-browser-container">
        loading...
      </div>
    }
    return (
      <div className="policy-browser-container">
        <PolicyOverview policy_id={policy_instance.policy_id}
          policy_instance={policy_instance}/>
        {policy_instance.content.map( (paragraph_content, i) => {
          return <PolicyParagraph
            idx={i}
            content={paragraph_content}
            key={i} />
        }
        )}
      </div>
    );
  }
}


export default connect(
  mapStateToProps,
  {  } // functions
)(PolicyBrowser);
