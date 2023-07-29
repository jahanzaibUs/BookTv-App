import React from "react";
import { ScrollView, Switch } from "native-base";

import { List } from "@components/List";
import { t } from "@utils/i18n";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { updateUserSetting } from "@actions/notificationAction";
import { getNotificationSetting } from "@selectors/notificationSelector";
import { defaultSetting } from "@reducers/notification";

interface Props {
  navigation: any;
}

export default function NotificationSetting({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(getNotificationSetting);

  const toggleSwitch = async (key: string) => {
    const updateVal = !settings[key];
    let nextSettings;

    // Toggle all
    if (key === "enabled") {
      if (updateVal === false) {
        nextSettings = defaultSetting;
      } else {
        nextSettings = {
          enabled: true,
          news: true,
          event: true,
          sub: true,
          message: true,
        };
      }
    } else {
      // Individual
      nextSettings = { ...settings, [key]: updateVal };
    }

    await dispatch(updateUserSetting(nextSettings));
  };

  const renderSwitch = (key: string) => {
    return (
      <Switch
        size="sm"
        onToggle={() => toggleSwitch(key)}
        isChecked={!!settings[key]}
      />
    );
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} flex={1} p={5}>
      <List mt={2} shadow={1}>
        <List.Item
          isFirst
          isLast
          disabled
          renderRightComponent={() => renderSwitch("enabled")}
        >
          {`${t("Receive")}${t("Push Notifications")}`}
        </List.Item>
      </List>

      <List mt={10} shadow={1}>
        <List.Item
          isFirst
          disabled
          renderRightComponent={() => renderSwitch("news")}
        >
          {t("NEWS_REMINDER")}
        </List.Item>
        <List.Item disabled renderRightComponent={() => renderSwitch("event")}>
          {t("EVENT_REMINDER")}
        </List.Item>
        <List.Item
          isLast
          disabled
          renderRightComponent={() => renderSwitch("message")}
        >
          {t("NEW_MESSAGE")}
        </List.Item>
        {/* <List.Item          
          disabled
          renderRightComponent={() => renderSwitch("sub")}
        >
          {t("SUBSCRIPTION_REMINDER")}
        </List.Item> */}
      </List>
    </ScrollView>
  );
}
