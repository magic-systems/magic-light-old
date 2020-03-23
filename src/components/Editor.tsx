import React from "react";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

import { TStore } from "../store";
import { updateCode } from "../actions";

import { UnControlled as CodeMirror } from "react-codemirror2";
import "codemirror/mode/javascript/javascript";
import "codemirror/lib/codemirror.css";

import "./Editor.css";

interface IProps {
  currentLineAnimationDuration?: number,
  currentLineColor?: string,
  currentStartLine: number,
  currentEndLine: number,
  onChange: any,
}

interface IState {
  codeEditor: any,
}

class Editor extends React.PureComponent<IProps & { className: string }, IState> {
  private _onChangeTimer: any;

  constructor(props: IProps & { className: string }){
    super(props);

    this.state = { codeEditor: null };

    this._onChange = this._onChange.bind(this);
    this._onEditorDidMount = this._onEditorDidMount.bind(this);
  }

  _onChange(editor: any, data: any, code: string) {
    clearTimeout(this._onChangeTimer);
    this._onChangeTimer = setTimeout(() => {
      this.props.onChange(editor, data, code);
    }, 500);
  }

  _onEditorDidMount(codeEditor: any) {
    this.setState({ codeEditor });
  }

  componentDidUpdate(prevProps: IProps) {
    const {
      currentLineColor: previousLineColor,
    } = prevProps;
    const {
      currentLineAnimationDuration,
      currentLineColor,
      currentStartLine,
      currentEndLine,
    } = this.props;
    const { codeEditor } = this.state;

    for (let line = 0; line < codeEditor.lineCount(); line++) {
      codeEditor.removeLineClass(line, "background", "current-line");
    }

    for (let line = currentStartLine - 1; line < currentEndLine; line++) {
      codeEditor.addLineClass(line, "background", "current-line");
    }

    let opacity = 0.2;
    let duration = 200;

    if (currentLineAnimationDuration !== undefined && previousLineColor !== currentLineColor) {
      duration = currentLineAnimationDuration;
      opacity = 1;
    }

    const nodeList: NodeListOf<HTMLElement> = document.querySelectorAll(".current-line");
    for (const element of nodeList) {
      element.animate(
        {
          backgroundColor: [previousLineColor || "", currentLineColor || previousLineColor || ""],
          opacity: [1 , opacity],
        },
        {
          duration,
          fill: "forwards",
        }
      );
    }
  }

  render() {
    const { className } = this.props;

		const options = {
      autofocus: true,
  	  lineNumbers: true,
      lineWrapping: true,
      mode: "javascript",
		};

    return <section className={className}>
      <CodeMirror
        onChange={this._onChange}
        editorDidMount={this._onEditorDidMount}
        options={options}
      />
    </section>
  }
}

const mapStateToProps = (store: TStore) => {
  return {
    currentLineAnimationDuration: store.state.currentLineAnimationDuration,
    currentLineColor: store.state.currentLineColor,
    currentStartLine: store.state.currentStartLine,
    currentEndLine: store.state.currentEndLine,
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<TStore, void, AnyAction>) => ({
  onChange: (editor: any, data: any, code: string) => {
    const cursor = editor.getCursor();
    const token = editor.getTokenAt(cursor);
    const cursorPosition = editor.cursorCoords();
    dispatch(updateCode(code, cursor, cursorPosition, token));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
