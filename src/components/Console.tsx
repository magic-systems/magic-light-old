import React from "react";
import { connect } from "react-redux";

import { TStore } from "../store";

import "./Console.css";

interface IProps {
  logs: any[],
}

class Console extends React.PureComponent<IProps & { className: string }> {
  _renderLogs() {
    const { logs } = this.props;

    if (logs.length === 0) {
      return null;
    }

    return <ul className="logs">
      {
        logs.map((log, index) => <li className={log.type} key={index}>{log.message}</li>)
      }
    </ul>
  }

  render() {
    const { className } = this.props;
    return <section className={className}>
      { this._renderLogs() }
    </section>
  }
}

const mapStateToProps = (store: TStore) => {
  return {
    logs: store.state.logs,
  }
}

export default connect(mapStateToProps)(Console);
