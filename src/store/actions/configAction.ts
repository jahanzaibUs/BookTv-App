import { Dispatch } from "@states/ReduxAction";
import API, { getError } from "../api";

/* Action types */

export const UPDATE_APP_CONFIG = "UPDATE_APP_CONFIG";

/* Actions */

export const updateAppConfig = (data: any) => ({
  type: UPDATE_APP_CONFIG,
  payload: data,
});

/* Async actions */

export const fetchAppConfig = () => async (dispatch: Dispatch) => {
  try {
    const { data }: any = await API.get(`/config`);

    dispatch(updateAppConfig(data));
  } catch (error) {
    getError(error);
  }
};
