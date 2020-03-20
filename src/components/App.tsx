import React from "react";
import Console from "./Console";
import Editor from "./Editor";
import Player from "./Player";

import "./App.css";

const App: React.FC = () => {
  return (
    <React.Fragment>
      <Editor className="editor"/>
      <Player className="player"/>
      <Console className="console"/>
    </React.Fragment>
  );
}

export default App;
