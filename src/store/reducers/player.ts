import { UPDATE_PLAYER } from "@actions/playerAction";
import { ReduxAction } from "@states/ReduxAction";
import { PlayerState, PlayerMode } from "@states/PlayerState";

// ISSUE - Lower value to reduce the impact of pitch distortion
export const PLAYBACK_SPEED = [
  {
    id: 1,
    value: 0.55,
    label: 0.5,
  },
  {
    id: 2,
    value: 0.8,
    label: 0.75,
  },
  {
    id: 3,
    value: 1.0,
    label: 1.0,
  },
  {
    id: 4,
    value: 1.2,
    label: 1.25,
  },
  {
    id: 5,
    value: 1.4,
    label: 1.5,
  },
];

const initialState = {
  isVisible: false,
  ref: null,
  mode: "video" as PlayerMode,
  url: "",
  isPlaying: false,
  rateId: PLAYBACK_SPEED[2].id,
  positionMillis: 0,
  durationMillis: 0,
  chapterIndex: 0,
  chapterId: 0,
};

const lessonReducer = (
  state = initialState,
  action: ReduxAction
): PlayerState => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_PLAYER: {
      if (payload) {
        return {
          ...state,
          ...payload,
        };
      }
      return initialState;
    }

    default:
      return state;
  }
};

export default lessonReducer;
