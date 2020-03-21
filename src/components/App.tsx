import React from "react";
import Console from "./Console";
import Editor from "./Editor";
import Player from "./Player";

import "./App.css";

const App: React.FC = () => {
  return (
    <React.Fragment>
      <Player className="player"/>
      <Editor className="editor"/>
      <Console className="console"/>
    </React.Fragment>
  );
}

export default App;
