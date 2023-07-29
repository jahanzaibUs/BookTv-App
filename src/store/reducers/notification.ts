import { ReduxAction } from "../states/ReduxAction";
import { NotificationState } from "../states/NotificationState";
import {
  ADD_REMOTE_NOTI,
  ADD_LOCAL_NOTI,
  UPDATE_NOTI,
  DELETE_NOTI,
  UPDATE_NOTI_SETTING,
} from "@actions/notificationAction";

export const defaultSetting = {
  enabled: false,
  news: false,
  event: false,
  sub: false,
  message: false,
};

const initialState: NotificationState = {
  setting: defaultSetting,
  data: [],
};

const notificationReducer = (
  state = initialState,
  action: ReduxAction
): NotificationState => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_NOTI_SETTING: {
      const {
        event_reminder,
        news_alert,
        subscription_reminder,
        message_alert,
      } = payload;
      return {
        ...state,
        setting: {
          enabled:
            news_alert || news_alert || subscription_reminder || message_alert,
          news: news_alert,
          event: event_reminder,
          sub: subscription_reminder,
          message: message_alert,
        },
      };
    }

    case ADD_REMOTE_NOTI: {
      const { date, request } = payload;

      const getNotificationType = (title: string) => {
        let type = "";

        if (title.includes("登記") || title.includes("活動")) {
          type = "event";
        }
        if (title.includes("會籍")) {
          type = "renew";
        }
        return type;
      };

      const formatItem = {
        date,
        id: request.identifier,
        title: request.content.title,
        body: request.content.body,
        data: request.content.data,
        isRead: false,
        type:
          request.content.data.type ||
          getNotificationType(request.content.title),
      };
      const newList = [formatItem, ...state.data];

      return {
        ...state,
        data: newList,
      };
    }

    case ADD_LOCAL_NOTI: {
      const date = new Date();
      const formatItem = {
        date: date.toISOString(),
        id: `${date.valueOf()}-${payload.title}`,
        title: payload.title,
        body: payload.body,
        data: payload.data,
        type: payload.type,
        isRead: false,
      };
      const newList = [formatItem, ...state.data];

      return {
        ...state,
        data: newList,
      };
    }

    case UPDATE_NOTI: {
      const updatedList = state.data.map((item) => {
        if (item.id === payload.id) {
          return { ...item, isRead: payload.isRead };
        }
        return item;
      });
      return {
        ...state,
        data: updatedList,
      };
    }

    case DELETE_NOTI: {
      return {
        ...state,
        data: state.data.filter((item) => item.id !== payload.id),
      };
    }

    default:
      return state;
  }
};

export default notificationReducer;
