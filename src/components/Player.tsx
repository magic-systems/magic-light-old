import React from "react";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

import { TStore } from "../store";
import {
  appendLog,
  updateCurrentLine,
  updateCurrentLineColor,
} from "../actions";

import "./Player.css";

const acorn = require("acorn");
const walker = require("acorn-walk")

interface IProps {
  code: string,
  appendLog: any,
  updateCurrentLine: any,
  updateCurrentLineColor: any,
}

interface IState {
  srcDoc: string,
}

const TEMPLATE =
`
"use strict";
return (async () => {
  try {
    $code
  } catch (e) {
    console.error(e);
  }
});
`;

class Player extends React.PureComponent<IProps & { className: string }, IState> {
  constructor(props: IProps & { className: string }) {
    super(props);
    this.state = { srcDoc: "" };
  }

  async componentDidMount() {
    const response = await fetch("./player.html");
    const srcDoc = await response.text();
    this.setState({ srcDoc });
  }

  _onLoad(event: any) {
    const win = event.currentTarget.contentWindow;
    win._updateCurrentLine = this.props.updateCurrentLine;
    win.updateCurrentLineColor = this.props.updateCurrentLineColor;

    win.console.error = (e: any) => {
      console.error(e);
      this.props.appendLog({ type: "error", message: e.message });
    }
    win.console.log = (content: any) => {
      console.log(content);
      this.props.appendLog({ type: "log", message: content.toString() });
    }

    const code = createCode(this.props.code);

    try {
      const func = new win.Function(TEMPLATE.replace("$code", code));
      const executable = func();
      executable();
    } catch (e) {
    }
  }

  render() {
    const { className } = this.props;
    // In order to clear the running function, we force to update.
    const meta = `<meta name="revised" content="${Date()}" />`
    const srcDoc = `${this.state.srcDoc}\n${meta}`;
    return <iframe className={className} onLoad={this._onLoad.bind(this)} srcDoc={srcDoc} title="player"></iframe>
  }
}

const mapStateToProps = (store: TStore) => {
  return {
    code: store.state.code,
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<TStore, void, AnyAction>) => ({
  appendLog: (log: any) => {
    dispatch(appendLog(log));
  },
  updateCurrentLine: (startLine: number, endLine: number) => {
    dispatch(updateCurrentLine(startLine, endLine));
  },
  updateCurrentLineColor: (currentLineColor: string, currentLineAnimationDuration: number) => {
    dispatch(updateCurrentLineColor(currentLineColor, currentLineAnimationDuration));
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
    code += `\n_updateCurrentLine(${result.loc.end.line}, ${result.loc.end.line});`

    return code;
  } catch (_) {
    return originalCode;
  }
}
