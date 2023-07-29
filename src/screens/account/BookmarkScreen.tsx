import React, { useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import { View, ScrollView, Center, Text } from "native-base";

import ROUTES from "@navigation/Routes";
import { t } from "@utils/i18n";
import { getCategories, getBookmarks } from "@store/selectors/lessonSelector";
import { LessonCategory, LessonItem } from "@store/states/LessonState";
import TabBar from "@components/TabBar";
import Section from "@components/Container/Section";
import Layout from "@styles/Layout";
import BookmarkListItem from "@components/LessonCard/BookmarkListItem";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { fetchBookmark } from "@store/actions/lessonAction";
import { getProfile } from "@store/selectors/authSelector";

interface BookmarkScreenProps {
  navigation: any;
}

type Section = { category: LessonCategory; data: LessonItem[] };

export default function BookmarkScreen({ navigation }: BookmarkScreenProps) {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(getProfile);
  const bookmarkLessons = useAppSelector(getBookmarks);
  const lessonCategories = useAppSelector(getCategories);
  const [tabIndex, setTabIndex] = useState(0);
  const [bookmarkSection, setBookmarkSection] = useState<Section[]>([]);

  useEffect(() => {
    const catIds = bookmarkLessons.map((bm) =>
      typeof bm.category === "number" ? bm.category : bm.category?.id
    );
    const categories = lessonCategories.filter((c) => catIds.includes(c.id));

    setBookmarkSection(
      categories.map((c) => ({
        category: c,
        data: bookmarkLessons.filter((b) =>
          typeof b.category === "number"
            ? b.category === c.id
            : b.category?.id === c.id
        ),
      }))
    );
  }, [bookmarkLessons.length]);

  const fetch = () => {
    dispatch(fetchBookmark(profile.id));
  };

  const onViewItem = (id: any) => {
    navigation.navigate(ROUTES.LESSON_TAB, {
      screen: ROUTES.VIDEO_LESSON,
      params: { id },
    });
  };

  const renderEmpty = () => (
    <Center width={Layout.scaleWidth(90)} height={Layout.scaleHeight(70)}>
      <Text>{t("EMPTY_CONTENT")}</Text>
    </Center>
  );

  const renderBooks = () => {
    return bookmarkSection.map(({ category, data }: Section) => {
      const catData = data.filter((b) =>
        typeof b.lesson_collection === "number"
          ? b.lesson_collection === tabIndex + 1
          : b.lesson_collection.id === tabIndex + 1
      );

      if (catData.length === 0) {
        return;
      }
      return (
        <Section
          key={category.id}
          data={catData}
          title={t(category.name)}
          size="md"
          useFlatList={false}
          renderItem={({
            item,
            index,
          }: {
            item: LessonItem;
            index: number;
          }) => (
            <BookmarkListItem
              key={item.id}
              title={item.title}
              desc={item.desc}
              author={item.author}
              imageSource={item.thumbnail}
              onPress={() => onViewItem(item.id)}
              isFirst={index === 0}
              played={index % 2 !== 0}
              totalTime={120000}
              currentTime={category.id * 6000}
            />
          )}
        />
      );
    });
  };

  return (
    <View _light={{ bg: "white" }} _dark={{ bg: "coolGray.900" }} flex={1}>
      <TabBar
        labels={["BookShop", "BookClub", "Course"]}
        selectedIndex={tabIndex}
        onChangeTab={(index) => setTabIndex(index)}
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => fetch()} />
        }
        _contentContainerStyle={{
          p: 5,
        }}
      >
        {renderBooks()}
      </ScrollView>
    </View>
  );
}
