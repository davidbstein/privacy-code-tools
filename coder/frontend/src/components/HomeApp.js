import React, { Component } from 'react';
import { connect } from 'react-redux';
import { apiGetCoding } from '../actions/api';

class HomeApp extends Component {
  constructor(props) {
    super(props);
    // do stuff
  }

  render() {
    return <div id='demo-container'><div id='demo-box'>
      <h1> privacy policy coding tools </h1>
      <div> This homepage will have a list of all the policies needing coding. </div>
      <div> For an example of the coding interface, try these programmatically generated links: </div>
        <ul>
          <li><a href="/code-policy/1">Google.com</a></li>
          <li><a href="/code-policy/2">Youtube.com</a></li>
          <li><a href="/code-policy/4">Facebook.com</a></li>
          <li><a href="/code-policy/5">Yahoo.com</a></li>
          <li><a href="/code-policy/6">Zoom.us</a></li>
          <li><a href="/code-policy/8">Wikipedia.org</a></li>
          <li><a href="/code-policy/9">Ebay.com</a></li>
          <li><a href="/code-policy/10">Netflix.com</a></li>
          <li><a href="/code-policy/11">Myshopify.com</a></li>
          <li><a href="/code-policy/12">Office.com</a></li>
          <li><a href="/code-policy/13">Instructure.com</a></li>
          <li><a href="/code-policy/14">Bing.com</a></li>
          <li><a href="/code-policy/15">Twitch.tv</a></li>
          <li><a href="/code-policy/16">Live.com</a></li>
          <li><a href="/code-policy/17">Chaturbate.com</a></li>
          <li><a href="/code-policy/18">Microsoftonline.com</a></li>
          <li><a href="/code-policy/19">Microsoft.com</a></li>
        </ul>
      <div> If there are already saved codings stored for {CURRENT_USER}, those codings will be loaded. </div>
      </div>
      </div>
  }
}

const mapStateToProps = state => ({
  model: state.model
});

export default connect(
  mapStateToProps,
  { apiGetCoding }
)(HomeApp);
