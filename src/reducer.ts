import { reducerWithInitialState } from "typescript-fsa-reducers";
import {
  AppendLogAction,
  UpdateCodeAction,
  UpdateCurrentLineAction,
  UpdateCurrentLineColorAction,
} from "./actions";

export interface IState {
  code: string,
  currentLineAnimationDuration?: number,
  currentLineColor?: string,
  currentStartLine: number,
  currentEndLine: number,
  logs: any[],
}

export const initialState: IState = {
  code: "",
  currentLineColor: "#ff1ad9",
  currentStartLine: 0,
  currentEndLine: 0,
  logs: [],
}

export const reducer = reducerWithInitialState(initialState)
  .case(AppendLogAction.done, (state, { result }) => {
    const logs = [...state.logs, result.log];
    return Object.assign({}, state, { logs });
  })
  .case(UpdateCodeAction.done, (state, { result }) => {
    return Object.assign({}, state, result, {
      logs: [],
      currentStartLine: 0,
      currentEndLine: 0,
    });
  })
  .case(UpdateCurrentLineAction.done, (state, { result }) => {
    return Object.assign({}, state, result);
  })
  .case(UpdateCurrentLineColorAction.done, (state, { result }) => {
    return Object.assign({}, state, result);
  });
