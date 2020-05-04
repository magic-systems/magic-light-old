import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { store } from "./store";

import AppWithauth from "./components/AppWithauth";
import "./index.css";

import Amplify from 'aws-amplify'
import config from './aws-exports'
Amplify.configure(config)

ReactDOM.render(
  <Provider store={store}>
    <AppWithauth />
  </Provider>
  , document.getElementById("root")
);
