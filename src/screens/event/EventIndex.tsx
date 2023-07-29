import React, { useEffect, useState } from "react";
import { RefreshControl, TouchableOpacity } from "react-native";
import {
  View,
  HStack,
  Heading,
  Icon,
  FlatList,
  SectionList,
  Text,
  Center,
} from "native-base";
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import ROUTES from "@navigation/Routes";
import TabBar from "@components/TabBar";
import EventCard from "@components/Event/EventCard";
import { t } from "@utils/i18n";
import {
  getBookEvents,
  getJoinedEvents,
  getShareEvents,
} from "@store/selectors/eventSelector";
import { fetchEvents } from "@store/actions/eventAction";
import { getProfile } from "@store/selectors/authSelector";
import { EventItem } from "@states/EventState";
import { useAppDispatch } from "@hooks/redux";

interface EventIndexProps {
  navigation: any;
}

export default function EventIndex({ navigation }: EventIndexProps) {
  const dispatch = useAppDispatch();
  const profile = useSelector(getProfile);
  const bookEvents = useSelector(getBookEvents);
  const shareEvents = useSelector(getShareEvents);
  const joinedEvents = useSelector(getJoinedEvents);
  const [featuredData, setFeaturedData] = useState<
    { title: string; data: any; type: string }[]
  >([]);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    let combined = [];

    if (bookEvents.length !== 0) {
      combined.push({
        title: t("Book club"),
        data: bookEvents,
        type: "book",
      });
    }
    if (bookEvents.length !== 0) {
      combined.push({
        title: t("Sharing"),
        data: shareEvents,
        type: "share",
      });
    }

    setFeaturedData(combined);
  }, [bookEvents, shareEvents]);

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = async () => {
    await dispatch(fetchEvents(profile.id));
  };

  const onViewEvents = (type: string, title: string) => {
    navigation.navigate(ROUTES.EVENT_LIST, { type, title });
  };

  const onViewItem = (id: any) => {
    navigation.navigate(ROUTES.EVENT_DETAIL, { id });
  };

  const renderItem = ({ item }: { item: EventItem }) => (
    <EventCard
      key={item.id}
      selected={item.going}
      name={item.name}
      price={item.price}
      startTime={item.start_time}
      imageSource={item.banner}
      onPress={() => onViewItem(item.id)}
      VIPOnly={item.restrict_subscriptions?.some((sub) => sub.tier === "T3")}
    />
  );

  const renderSectionHeader = ({
    section: { title, type, data },
  }: {
    section: { title: string; type: string; data: EventItem[] };
  }) => {
    if (data.length !== 0) {
      return (
        <HStack
          mt={3}
          mb={5}
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading size="lg">{title}</Heading>
          <TouchableOpacity onPress={() => onViewEvents(type, title)}>
            <HStack alignItems="center">
              <Heading fontSize="sm" color="primary.300">
                {t("More")}
              </Heading>
              <Icon
                as={<Feather name="chevron-right" />}
                size="xs"
                color="primary.300"
              />
            </HStack>
          </TouchableOpacity>
        </HStack>
      );
    }
    return null;
  };

  const FeatureEvents = () => (
    <SectionList
      sections={featuredData}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={onRefresh} />
      }
      keyExtractor={(item) => `${item.id}`}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      stickySectionHeadersEnabled={false}
      ListEmptyComponent={() => (
        <Center flex={1} pt="50%">
          <Text>{t("EMPTY_EVENT")}</Text>
        </Center>
      )}
      contentContainerStyle={{
        paddingBottom: 100,
      }}
      px={5}
      mt={3}
    />
  );

  const UserEvents = () => (
    <FlatList
      data={joinedEvents}
      keyExtractor={(item) => `${item.id}`}
      renderItem={renderItem}
      ListEmptyComponent={() => (
        <Center flex={1}>
          <Text>{t("EMPTY_EVENT")}</Text>
        </Center>
      )}
      contentContainerStyle={{
        paddingBottom: 100,
      }}
      px={5}
      py={5}
    />
  );

  return (
    <View flex={1} _light={{ bg: "white" }} _dark={{ bg: "coolGray.900" }}>
      <TabBar
        labels={["Upcoming", "Going"]}
        selectedIndex={tabIndex}
        onChangeTab={(index) => setTabIndex(index)}
      />
      {tabIndex === 0 ? <FeatureEvents /> : <UserEvents />}
    </View>
  );
}
