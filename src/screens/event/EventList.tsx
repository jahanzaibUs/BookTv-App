import React, { useEffect } from "react";
import { FlatList } from "native-base";
import { useSelector } from "react-redux";

import { t } from "@utils/i18n";
import ROUTES from "@navigation/Routes";
import EventCard from "@components/Event/EventCard";
import { getBookEvents, getShareEvents } from "@store/selectors/eventSelector";
import { EventItem } from "@store/states/EventState";

interface EventListProps {
  navigation: any;
  route: any;
}

export default function EventList({ navigation, route }: EventListProps) {
  const bookEvents = useSelector(getBookEvents);
  const shareEvents = useSelector(getShareEvents);

  useEffect(() => {
    navigation.setOptions({
      title: t(route.params.title),
    });
  }, [route]);

  const onViewItem = (id: any) => {
    navigation.navigate(ROUTES.EVENT_DETAIL, { id });
  };

  const renderItem = ({ item, index }: { item: EventItem; index: number }) => (
    <EventCard
      selected={item.going}
      name={item.name}
      startTime={item.start_time}
      imageSource={item.banner}
      onPress={() => onViewItem(item.id)}
      price={item.price}
      VIPOnly={item.restrict_subscriptions?.some((sub) => sub.tier === "T3")}
    />
  );

  return (
    <FlatList
      data={route.params.type === "book" ? bookEvents : shareEvents}
      keyExtractor={(item) => `${item.id}`}
      renderItem={renderItem}
      px={5}
      py={5}
    />
  );
}
