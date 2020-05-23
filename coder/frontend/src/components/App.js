import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import CodingInterfaceApp from './CodingInterfaceApp'

import { Provider } from 'react-redux';
import store from '../store';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <CodingInterfaceApp
            policy_id={4}
            policy_instance_id={1}
            coding_id={1}
            />
        </div>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#app'));
