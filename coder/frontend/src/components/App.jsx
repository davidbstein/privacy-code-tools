import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "src/store";
import MainRouter from "./MainRouter";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <MainRouter />
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.querySelector("#app"));
