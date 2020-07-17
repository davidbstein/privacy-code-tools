import React, { Component } from 'react';
import { connect } from 'react-redux';
import { userToggleSentence } from '../../actions/userActions';
import {
  apiAutoSave
} from '../../actions/api';
import _ from 'lodash';

const mapStateToProps = state => ({
  model: state.model,
  localState: state.localState
});


const PolicySentence = connect(
  mapStateToProps,
  {userToggleSentence, apiAutoSave}
)(
  class PolicySentence extends Component {
    constructor(props, context){
      super(props);
      this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
      this.props.userToggleSentence(
        this.props.policy_type,
        this.props.paragraph_idx,
        this.props.idx,
      );
      this.props.apiAutoSave();
    }

    _checkSentence(selected_sentences){
        return (
          selected_sentences &&
          selected_sentences[this.props.paragraph_idx] &&
          (
            (selected_sentences[this.props.paragraph_idx].indexOf(this.props.idx) >= 0) ||
            (selected_sentences[this.props.paragraph_idx].indexOf(this.props.idx) >= 0)
          )
        )
    }

    _get_selected_sentences(coding_instance, policy_type){
      const cur_question = (
        coding_instance[this.props.localState.selectedQuestionIdentifier] ||
        coding_instance[this.props.localState.selectedQuestion] ||
        {}
      )
     return (cur_question.sentences || {})[policy_type];
    }


    _basicHighlightTest() {
      const selected_sentences = this._get_selected_sentences(this.props.localState.localCoding, this.props.policy_type)
      var extra_class = 'unselected'
      if (this._checkSentence(selected_sentences))
        extra_class="selected"
      return extra_class;
    }

    _mergeHighlightTest() {
      // TODO: count the number of people who have highlighted this sentence
      var count = 0
      var highlight_count = 0
      for (var ci of _.values(this.props.model.coding_instances)){
        count++;
        const sentences = this._get_selected_sentences(ci.coding_values, this.props.policy_type)
        if (this._checkSentence(sentences))
          highlight_count++;
      }
      var extra_class = ''
      if (highlight_count > 0) {
        extra_class=`highlight-count-${Math.min(highlight_count, 5)}`
      }
      return extra_class;
    }

    _highlightTest() {
      var extra_class = this._basicHighlightTest();
      if (this.props.localState.merge_mode)
        extra_class += " " + this._mergeHighlightTest();
      return extra_class;
    }

    render() {
      const extra_class = this._highlightTest()
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
    var is_header = ""
    if ((this.props.content[0] || "").startsWith("§"))
      is_header += " is-header "
    return <div
      className="policy-browser-paragraph"
      id={`paragraph-${this.props.policy_type}-${this.props.idx}`}
    >
      <div className='policy-browser-paragraph-num'>{this.props.idx+1}</div>
      <div className={'policy-browser-paragraph-content' + is_header}>
        {this.props.content.map((sentence_content, i)=>
          <PolicySentence
            idx={i}
            key={i}
            policy_type={this.props.policy_type}
            paragraph_idx={this.props.idx}
            content={sentence_content}
            />
        )}
      </div>
    </div>
  }
}


const PolicyPage = connect(
  mapStateToProps,
  {apiAutoSave}
)(
  class PolicyPage extends Component {
    constructor(props, context){
      super(props, context);
    }
    render() {
      const policy = this.props.model.policies[this.props.policy_id];
      if (!policy) {
        return <div />
      }
      const href = policy.urls[this.props.policy_type];
      return <div className="policy-browser-section-container">
        <div className="policy-browser-section-overview">
          <h3 id={this.props.policy_type}> {this.props.policy_type} </h3>
          <div> URL of source document: <a href={href} target="_blank">{href}</a> </div>
          <div> Reference Snapshot <a href={`/raw-policy/${this.props.policy_instance.id}/${this.props.policy_type}`}> View Original Snapshot</a></div>
          <b> if the source document and snapshot disagree, use the snapshot (all policies were preseved at the same time)</b>
        </div><div className="policy-browser-major-section">
        {
          this.props.policy_content.map(
            (paragraph_content, i) => {
              return <PolicyParagraph
                idx={i}
                content={paragraph_content}
                policy_type={this.props.policy_type}
                key={i} />
            }
          )
        }
        </div>
      </div>
    }
  }
)


const PolicyOverview = connect(
  mapStateToProps,
  {}
)(
  class PolicyOverview extends Component {
    render() {
      const policy = this.props.model.policies[this.props.policy_id];
      if (!policy) {
        return <div />
      }
      document.title = `${this.props.localState.updateSinceLastSave ? policy.company_name : "* " + policy.company_name}`;
      return <div className="policy-browser-overview">
        <h1> {policy.company_name} </h1>
        <div> Alexa Rank: {policy.alexa_rank} </div>
        <div> Policies Included: {
          _.map(_.keys(this.props.content), (e,i)=>
            <span className='policy-browser-overview-token' key={i}>{e}</span>)
        }</div>
      </div>
    }
  }
)


class PolicyBrowser extends Component {
  componentDidMount() {
    const pbc = document.getElementById('policy-browser-container');
    pbc.onscroll = _.throttle(
      function(e){
        const headings = document.getElementsByClassName("policy-browser-section-container");
        const idx = _.sum(_.map(headings, (h) => pbc.scrollTop - h.offsetTop > 0)) - 1;
        for (var _i=0; _i < headings.length; _i++) {
          const h = headings[_i];
          if (_i === idx) {
            h.classList.add("active-policy");
          } else {
            h.classList.remove("active-policy");
          }
        }
      }.bind(this), 100, {leading: true}
    )
  }
  render() {
    const policy_instance = this.props.model.policy_instances[this.props.policy_instance_id];
    if (policy_instance == undefined) {
      return <div className="policy-browser-container" id="policy-browser-container">
        loading...
      </div>
    }
    const policy_pages = [];
    for (const policy_type of ['privacy_policy', 'tos', 'ccpa_policy', 'gdpr_policy', 'eu_privacy_policy', 'eu_privacy_policy']){
      const policy_content = policy_instance.content[policy_type];
      if (policy_content){
        policy_pages.push(<PolicyPage
          key={policy_type}
          coding_id={this.props.coding_id}
          policy_content={policy_content}
          policy_id={policy_instance.policy_id}
          policy_instance={policy_instance}
          policy_type={policy_type}
          />)
      }
    }
    return (
      <div className="policy-browser-container" id="policy-browser-container">
        <PolicyOverview
          policy_id={policy_instance.policy_id}
          policy_instance={policy_instance}
          content={policy_instance.content}/>
        {policy_pages}
      </div>
    );
  }
}


export default connect(
  mapStateToProps,
  {  } // functions
)(PolicyBrowser);
