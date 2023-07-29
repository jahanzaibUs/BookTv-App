import React from "react";
import { FlatList } from "native-base";

import ROUTES from "@navigation/Routes";
import NotificationItem from "@components/Notification/NotificationItem";

import { openLink } from "@utils/link";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { updateNotification } from "@actions/notificationAction";
import { getNotificationList } from "@selectors/notificationSelector";
import { LocalNotification } from "@states/NotificationState";
import EmptyView from "@components/Container/EmptyView";

interface NotificationScreenProps {
  navigation: any;
}

export default function NotificationScreen({
  navigation,
}: NotificationScreenProps) {
  const dispatch = useAppDispatch();
  const notificationData = useAppSelector(getNotificationList);

  const onViewDetail = async (item: any) => {
    const { type, data } = item;
    if (type === "renew") {
      navigation.navigate(ROUTES.ACCOUNT_TAB, {
        initial: false,
        screen: ROUTES.PURCHASE_RECORD,
      });
    }
    if (type === "event") {
      navigation.navigate(ROUTES.EVENT_TAB, {
        initial: false,
        screen: ROUTES.EVENT_DETAIL,
        params: {
          id: data.id,
        },
      });
    } else if (data && data.url) {
      openLink(data.url);
    }

    await dispatch(updateNotification({ id: item.id, isRead: true }));
  };

  const renderItem = ({ item }: { item: LocalNotification }) => (
    <NotificationItem
      date={item.date}
      title={item.title}
      body={item.body}
      data={item.data}
      type={item.type}
      isRead={item.isRead}
      onPress={() => onViewDetail(item)}
    />
  );

  return (
    <FlatList
      data={notificationData}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListEmptyComponent={
        <EmptyView title="EMPTY_NOTIFICATION" iconName="mail-open" pt="55%" />
      }
    />
  );
}
