import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { actionCreatorFactory } from "../node_modules/typescript-fsa";
import { TStore } from "./store";

const actionCreator = actionCreatorFactory()

export const UpdateCodeAction =
  actionCreator.async<
    { code: string, cursor: any, cursorPosition: any, token: any },
    { code: string, cursor: any, cursorPosition: any, token: any },
    { error: any }
  >("UPDATE_CODE");
export const UpdateCurrentLineAction =
  actionCreator.async<{ currentStartLine: number, currentEndLine: number }, {}, { error: any }>("UPDATE_CURRENT_LINE");

export function updateCode(code: string, cursor: any, cursorPosition: any, token: any) {
  return async (dispatch: ThunkDispatch<TStore, void, AnyAction>, getState: () => TStore) => {
    const params = {code, cursor, cursorPosition, token};
    try {
      dispatch(UpdateCodeAction.started(params));
      dispatch(UpdateCodeAction.done({ result: params, params}));
    } catch (error) {
      dispatch(UpdateCodeAction.failed({ error, params }));
    }
  }
}

export function updateCurrentLine(currentStartLine: number, currentEndLine: number) {
  return async (dispatch: ThunkDispatch<TStore, void, AnyAction>, getState: () => TStore) => {
    const params = { currentStartLine, currentEndLine };
    try {
      dispatch(UpdateCurrentLineAction.started(params));
      dispatch(UpdateCurrentLineAction.done({ result: params, params}));
    } catch (error) {
      dispatch(UpdateCurrentLineAction.failed({ error, params }));
    }
  }
}
