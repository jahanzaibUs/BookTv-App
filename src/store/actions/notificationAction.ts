import { Notification } from "expo-notifications";
import { Dispatch } from "@states/ReduxAction";
import {
  LocalNotificationInput,
  SettingState,
} from "@states/NotificationState";
import API, { getError } from "../api";

/* Action types */

export const ADD_REMOTE_NOTI = "ADD_REMOTE_NOTI";
export const ADD_LOCAL_NOTI = "ADD_LOCAL_NOTI";
export const UPDATE_NOTI = "UPDATE_NOTI";
export const DELETE_NOTI = "DELETE_NOTI";
export const UPDATE_NOTI_SETTING = "UPDATE_NOTI_SETTING";

/* Actions */

export const addNotification = (data: Notification) => ({
  type: ADD_REMOTE_NOTI,
  payload: data,
});

/**
 * Inbox alert
 */
export const addLocalNotification = (data: LocalNotificationInput) => ({
  type: ADD_LOCAL_NOTI,
  payload: data,
});

export const updateNotification = (data: { id: string; isRead: boolean }) => ({
  type: UPDATE_NOTI,
  payload: data,
});

export const deletehNotification = (data: { id: string }) => ({
  type: DELETE_NOTI,
  payload: data,
});

export const updateNotificationSetting = (data: any) => ({
  type: UPDATE_NOTI_SETTING,
  payload: data,
});

/* Async actions */

export const updateUserSetting =
  (form: SettingState) => async (dispatch: Dispatch) => {
    try {
      const { data } = await API.post(`/user-settings`, {
        event_reminder: form.event,
        news_alert: form.news,
        subscription_reminder: form.sub,
        message_alert: form.message,
      });
      console.log(data);

      dispatch(updateNotificationSetting(data));
      return {
        success: true,
      };
    } catch (error) {
      const message = getError(error);
      return {
        success: false,
        message,
      };
    }
  };
