import { ReduxAction } from "../states/ReduxAction";
import { EventState } from "../states/EventState";
import {
  FETCH_EVENTS_START,
  FETCH_EVENTS_SUCCESS,
  FETCH_REG_EVENTS_SUCCESS,
  UPDATE_JOIN_EVENT,
} from "@actions/eventAction";

const initialState: EventState = {
  loading: false,
  error: false,
  data: [],
  registers: [],
};

const eventReducer = (
  state = initialState,
  action: ReduxAction
): EventState => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_JOIN_EVENT: {
      let newData = state.registers;

      if (payload.status === "registered" || payload.status === "paid") {
        newData = [payload, ...state.registers];
      } else {
        newData = state.registers.filter((r) => r.id !== payload.id);
      }

      return {
        ...state,
        registers: newData,
      };
    }

    case FETCH_EVENTS_START: {
      return {
        ...state,
        loading: true,
      };
    }

    case FETCH_EVENTS_SUCCESS: {
      return {
        ...state,
        loading: false,
        data: payload,
      };
    }

    case FETCH_REG_EVENTS_SUCCESS: {
      return {
        ...state,
        registers: payload,
      };
    }

    default:
      return state;
  }
};

export default eventReducer;
