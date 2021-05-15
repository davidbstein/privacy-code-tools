
import React, { Component } from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
    model: state.model,
    localState: state.localState
  });
  
export default connect(
    mapStateToProps,
    {}
  )(
    class CodingOverview extends Component {
      render() {
        if (!true) {
          return <div />
        }
        return <div className="policy-browser-overview">
          <h1> Coding </h1>
          <div> Coding will be attributed to <b>{CURRENT_USER}</b> </div>
          <div> This form will auto-save. You can also press <tt>ctrl+s</tt> (windows), <tt>⌘+s</tt> (mac), or hit the "save" button at the bottom of this form. </div>
        </div>
      }
    }
  )