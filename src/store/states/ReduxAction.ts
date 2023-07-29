import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { RootState } from "./RootState";

export interface ReduxAction {
  type: string;
  payload?: any;
  error?: any;
}

export type ThunkResult<R> = ThunkAction<R, RootState, void, ReduxAction>;

export type Thunk = ThunkResult<Promise<Action>>;

export type Dispatch = ThunkDispatch<any, any, Action>;
