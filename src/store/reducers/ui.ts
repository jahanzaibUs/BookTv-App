import { ReduxAction } from "../states/ReduxAction";
import { SHOW_AUTH_WALL, HIDE_AUTH_WALL } from "../actions/uiAction";
import { UIState } from "../states/UIState";

const initialState: UIState = {
  showAuthSheet: false,
};

const uiReducer = (state = initialState, action: ReduxAction): UIState => {
  const { type } = action;

  switch (type) {
    case SHOW_AUTH_WALL: {
      return {
        ...state,
        showAuthSheet: true,
      };
    }

    case HIDE_AUTH_WALL: {
      return {
        ...state,
        showAuthSheet: false,
      };
    }

    default:
      return state;
  }
};

export default uiReducer;
