import { combineReducers } from "redux";
import authReducer from "./auth";
import configReducer from "./config";
import lessonReducer from "./lesson";
import eventReducer from "./event";
import notificationReducer from "./notification";
import uiReducer from "./ui";
import questReducer from "./quest";
import playerReducer from "./player";
import { LOGOUT } from "../actions/authAction";
import { clear } from "@utils/storage";

const appReducer = combineReducers({
  auth: authReducer,
  config: configReducer,
  lesson: lessonReducer,
  event: eventReducer,
  notification: notificationReducer,
  ui: uiReducer,
  quest: questReducer,
  player: playerReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === LOGOUT) {
    clear();

    const cleanState = {
      ...state,
      auth: undefined,
      lesson: undefined,
      quest: undefined,
      event: undefined,
      notification: undefined,
      ui: undefined,
      player: undefined,
    };
    return appReducer(cleanState, action);
  }

  return appReducer(state, action);
};

export default rootReducer;
