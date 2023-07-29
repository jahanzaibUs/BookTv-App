import { ReduxAction } from "../states/ReduxAction";
import { QuestState } from "../states/QuestState";
import {
  FETCH_EXP,
  FETCH_MISSION,
  FETCH_REWARD,
  FETCH_USER_QUEST,
  FETCH_QUEST_START,
  FETCH_QUEST_ERROR,
  FETCH_USER_GIFT,
} from "@actions/questAction";

const initialState: QuestState = {
  loading: false,
  error: false,
  level: "0",
  totalExp: 0,
  nextLvExp: 0,
  expSources: [],
  rewards: [],
  missions: [],
  expGains: [],
  rewardLog: [],
  giftReward: [],
  giftLog: [],
  missionSum: [],
  currentStreak: {
    startDate: "",
    endDate: "",
    length: 0,
  },
};

const questReducer = (
  state = initialState,
  action: ReduxAction
): QuestState => {
  const { type, payload } = action;

  switch (type) {
    case FETCH_QUEST_START: {
      return {
        ...state,
        loading: true,
        error: false,
      };
    }

    case FETCH_QUEST_ERROR: {
      return {
        ...state,
        loading: false,
        error: true,
      };
    }

    case FETCH_USER_QUEST: {
      return {
        ...state,
        ...payload,
        loading: false,
      };
    }

    case FETCH_MISSION: {
      return {
        ...state,
        missions: payload,
      };
    }

    case FETCH_REWARD: {
      return {
        ...state,
        rewards: payload,
      };
    }

    case FETCH_EXP: {
      return {
        ...state,
        expSources: payload,
      };
    }

    case FETCH_USER_GIFT: {
      return {
        ...state,
        giftReward: payload.giftReward,
        giftLog: payload.giftLog,
      };
    }

    default:
      return state;
  }
};

export default questReducer;
