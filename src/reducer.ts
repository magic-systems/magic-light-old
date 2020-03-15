import { reducerWithInitialState } from "typescript-fsa-reducers";
import {
  UpdateCodeAction,
  UpdateCurrentLineAction,
} from "./actions";

export interface IState {
  code: string,
  currentStartLine: number,
  currentEndLine: number,
}

export const initialState: IState = {
  code: "",
  currentStartLine: 0,
  currentEndLine: 0,
}

export const reducer = reducerWithInitialState(initialState)
  .case(UpdateCodeAction.done, (state, { result }) => {
    return Object.assign({}, state, result);
  })
  .case(UpdateCurrentLineAction.done, (state, { result }) => {
    return Object.assign({}, state, result);
  });
