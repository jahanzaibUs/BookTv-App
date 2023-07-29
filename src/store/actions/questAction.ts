import { Dispatch } from "@states/ReduxAction";
import moment from "moment";
import API, { getError } from "../api";

/* Action types */

export const FETCH_EXP = "FETCH_EXP";
export const FETCH_MISSION = "FETCH_MISSION";
export const FETCH_REWARD = "FETCH_REWARD";
export const FETCH_USER_DAILY_EXP = "FETCH_USER_DAILY_EXP";
export const FETCH_USER_QUEST = "FETCH_USER_QUEST";
export const FETCH_QUEST_START = "FETCH_QUEST_START";
export const FETCH_QUEST_ERROR = "FETCH_QUEST_ERROR";
export const FETCH_USER_GIFT = "FETCH_USER_GIFT";

/* Actions */

export const fetchExpSuccess = (data: any) => ({
  type: FETCH_EXP,
  payload: data,
});

export const fetchMissionSuccess = (data: any) => ({
  type: FETCH_MISSION,
  payload: data,
});

export const fetchRewardSuccess = (data: any) => ({
  type: FETCH_REWARD,
  payload: data,
});

export const fetchDailyExpSuccess = (data: any) => ({
  type: FETCH_USER_DAILY_EXP,
  payload: data,
});

export const fetchQuestSuccess = (data: any) => ({
  type: FETCH_USER_QUEST,
  payload: data,
});

export const fetchQuestStart = () => ({
  type: FETCH_QUEST_START,
});

export const fetchQuestError = (err?: string) => ({
  type: FETCH_QUEST_ERROR,
  payload: err,
});

export const fetchGiftSuccess = (data: any) => ({
  type: FETCH_USER_GIFT,
  payload: data,
});

type ExpForm = {
  source: number;
  lesson?: number;
};

/* Async actions */

export const postExpEvent = (form: ExpForm[]) => async (dispatch: Dispatch) => {
  try {
    let expForm;

    if (form.length > 1) {
      expForm = { batch: form };
    } else {
      expForm = form[0];
    }

    console.log(expForm);
    const { data } = await API.post(`/exp-logs`, expForm);
    console.log(data);

    if (data) {
      dispatch(fetchUserQuest());
    }

    return { success: true, data };
  } catch (error) {
    const message = getError(error);
    return { success: false, message };
  }
};

export const fetchUserQuest = () => async (dispatch: Dispatch) => {
  dispatch(fetchQuestStart());
  try {
    const { data } = await API.get(`/quest`);
    dispatch(fetchQuestSuccess(data));
  } catch (error) {
    const message = getError(error);
    dispatch(fetchQuestError(message));
  }
};

export const fetchRewardByLevel = () => async (dispatch: Dispatch) => {
  try {
    const getExps = API.get(`/exps`);
    const getLevels = API.get(`/levels`);
    const getMissions = API.get(`/missions?_sort=id:ASC`);

    const [exps, levels, missions] = await Promise.all([
      getExps,
      getLevels,
      getMissions,
    ]);

    dispatch(fetchExpSuccess(exps.data));
    dispatch(fetchRewardSuccess(levels.data));
    dispatch(fetchMissionSuccess(missions.data));
  } catch (error) {
    const message = getError(error);
    dispatch(fetchQuestError(message));
  }
};

export const fetchDailyExp = async () => {
  try {
    const { data } = await API.get(
      `/exp-logs/sum/${moment().format("YYYY-MM-DD")}`
    );
    return {
      success: true,
      data,
    };
  } catch (error) {
    const message = getError(error);
    return {
      success: false,
      message,
    };
  }
};

export const submitGiftCode = async (code: string) => {
  try {
    const response: any = await API.put(`/gift-logs?code=${code}`, {
      code,
    });
    return {
      success: response.status === 200,
    };
  } catch (error: any) {
    return {
      success: false,
    };
  }
};

export const fetchGifts = () => async (dispatch: Dispatch) => {
  try {
    const { data } = await API.get(`/gift-logs/me`);
    dispatch(fetchGiftSuccess(data));
    return {
      success: true,
      data,
    };
  } catch (error) {
    const message = getError(error);
    return {
      success: false,
      message,
    };
  }
};
