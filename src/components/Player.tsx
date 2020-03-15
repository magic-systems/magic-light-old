import React from "react";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

import { TStore } from "../store";
import { updateCurrentLine } from "../actions";

import "./Player.css";

const acorn = require("acorn");
const walker = require("acorn-walk")

interface IProps {
  code: string,
  updateCurrentLine: any,
}

const TEMPLATE =
`
"use strict";
return (async () => {
  $code
});
`;

class Player extends React.PureComponent<IProps> {
  _onLoad(e: any) {
    const win = e.currentTarget.contentWindow;
    win._updateCurrentLine = this.props.updateCurrentLine;

    try {
      const code = createCode(this.props.code);
      const executable = (new win.Function(TEMPLATE.replace("$code", code)))();
      executable();
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    // In order to clear the running function, we force to update.
    const url = `./player.html?${Date.now()}`
    return <iframe className="player" onLoad={this._onLoad.bind(this)} src={url} title="player"></iframe>
  }
}

const mapStateToProps = (store: TStore) => {
  return {
    code: store.state.code,
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<TStore, void, AnyAction>) => ({
  updateCurrentLine: (startLine: number, endLine: number) => {
    dispatch(updateCurrentLine(startLine, endLine));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Player);

function createCode(originalCode: string) {
  try {
    let code = "";
    let previous: any = { end: 0 };

    const result = acorn.parse(originalCode, {
      allowAwaitOutsideFunction: true,
      locations: true,
    });

    walker.full(result, (node: any) => {
      if (node.type !== "ExpressionStatement") {
        return;
      }

      const pre = originalCode.substring(previous.end, node.start);
      const trace = `_updateCurrentLine(${node.loc.start.line}, ${node.loc.end.line});`
      const body = originalCode.substring(node.start, node.end);
      code += `${pre}\n${trace}\n${body}`;

      previous = node;
    });

    code += originalCode.substring(previous.end, result.end);
    code += `_updateCurrentLine(${result.loc.end.line}, ${result.loc.end.line});`

    return code;
  } catch (_) {
    return originalCode;
  }
}
