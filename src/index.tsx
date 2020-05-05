import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { store } from "./store";

import AppWithauth from "./components/AppWithauth";
import "./index.css";

import Amplify from 'aws-amplify'
import config from './aws-exports'

let cofigureupdate: any = config;
cofigureupdate.oauth.redirectSignIn = "https://d12k0vwzjdf4c7.cloudfront.net/";
cofigureupdate.oauth.redirectSignOut = "https://d12k0vwzjdf4c7.cloudfront.net/";
Amplify.configure(cofigureupdate)

ReactDOM.render(
  <Provider store={store}>
    <AppWithauth />
  </Provider>
  , document.getElementById("root")
);
