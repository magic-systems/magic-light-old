import React from "react";
import Editor from "./Editor";
import Player from "./Player";

import "./App.css";

const App: React.FC = () => {
  return (
    <React.Fragment>
      <Editor/>
      <Player/>
    </React.Fragment>
  );
}

export default App;
