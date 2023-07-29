import { useState, useEffect } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import crashlytics from "@react-native-firebase/crashlytics";

import API from "@store/api";

const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

export default function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] =
    useState<Notifications.Notification>();
  const [response, setNotificationResponse] =
    useState<Notifications.Notification>();

  // Foreground behavior
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
    handleSuccess: async (notificationId) =>
      console.log("[foreground notification] success", notificationId),
    handleError: async (notificationId, error) =>
      console.log("[foreground notification] error", notificationId, error),
  });

  // Background behavior
  TaskManager.defineTask(
    BACKGROUND_NOTIFICATION_TASK,
    ({ data, error, executionInfo }) => {
      console.log("Received a notification in the background!");
      // Do something with the notification data
      console.log("[task notification]", JSON.stringify(data));
    }
  );

  useEffect(() => {
    async function initService() {
      const token = await registerForPushNotificationsAsync();

      if (token) {
        setExpoPushToken(token);
        registerPushToken(token, Platform.OS);
      }
    }

    // Register token
    initService();

    // Fired in foreground
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("[notification received]", JSON.stringify(notification));
        setNotification(notification);
      }
    );
    // Fired in foreground, background and killed
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("[notification pressed]", JSON.stringify(response));
        setNotificationResponse(response.notification);
      });

    Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

    return () => {
      notificationListener.remove();
      responseListener.remove();
      Notifications.unregisterTaskAsync(BACKGROUND_NOTIFICATION_TASK);
    };
  }, []);

  return { expoPushToken, notification, response };
}

async function registerForPushNotificationsAsync() {
  try {
    let token;
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    console.log("[notification status]", finalStatus);

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.warn("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("[expoPushToken]", token);

    return token;
  } catch (error: any) {
    console.error(error);
    crashlytics().recordError(error);
  }
}

// Post token to Strapi plugin
export const registerPushToken = async (token: string, OS: string) => {
  try {
    const response: any = await API.post(`/notification-expo/expotokens`, {
      token,
      platform: OS,
    });
    return {
      success: response.status === 200,
    };
  } catch (error: any) {
    console.error(error);
    crashlytics().recordError(error);
    return {
      success: false,
    };
  }
};

export async function schedulePushNotification({
  content,
  trigger,
}: Notifications.NotificationRequestInput) {
  const receipt = await Notifications.scheduleNotificationAsync({
    content,
    trigger,
  });
  console.log(receipt);
}
