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

  _getHighlighterStyle(line: number) {
    const { codeEditor } = this.state;
    const bounds = codeEditor.cursorCoords({ line });
    return {
      top: `${bounds.top}px`,
      height: `${bounds.bottom - bounds.top}px`,
    };
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

  _renderHighlighters() {
    const { codeEditor } = this.state;
    if (!codeEditor) {
      return null;
    }

    const { currentStartLine, currentEndLine } = this.props;
    const marks = [];

    for (let line = currentStartLine - 1; line < currentEndLine; line++) {
      marks.push(<mark style={this._getHighlighterStyle(line)}></mark>);
    }

    return <section className="highlight-layer">{marks}</section>
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
      { this._renderHighlighters() }
    </section>
  }
}

const mapStateToProps = (store: TStore) => {
  return {
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
