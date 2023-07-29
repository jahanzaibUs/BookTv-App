export interface SettingState {
  [enabled: string]: boolean;
  news: boolean;
  event: boolean;
  sub: boolean;
  message: boolean;
}

export interface LocalNotificationInput {
  title: string;
  body?: string;
  data?: {
    [key: string]: any;
  };
  type?: string;
}

export interface LocalNotification {
  id: string;
  date: string;
  title: string;
  body?: string;
  data?: {
    [key: string]: any;
  };
  type?: string;
  isRead: boolean;
}

export interface NotificationState {
  data: LocalNotification[];
  setting: SettingState;
}
