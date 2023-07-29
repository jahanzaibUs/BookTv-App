import { createSelector } from "reselect";

import { RootState } from "../states/RootState";

const getNotificationState = (state: RootState) => state.notification;

export const getNotificationSetting = createSelector(
  getNotificationState,
  (notificationState) => notificationState.setting
);

export const getNotificationList = createSelector(
  getNotificationState,
  (notificationState) => notificationState.data
);

export const getNotificationCount = createSelector(
  getNotificationList,
  (list) => list.filter((item) => !item.isRead).length
);
