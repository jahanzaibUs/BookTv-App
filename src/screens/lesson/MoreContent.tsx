import React, { useEffect, useState } from "react";
import { Center, FlatList, Text, useToast } from "native-base";

import ROUTES from "@navigation/Routes";
import { t } from "@utils/i18n";
import { LessonItem } from "@store/states/LessonState";
import { fetchLessonByCategory, searchLesson } from "@data-fetch/lesson";
import BookListItem from "@components/LessonCard/BookListItem";
import IconButton from "@components/IconButton";
import FilterModal from "@components/Search/FilterModal";
import Layout from "@styles/Layout";
import Spinner from "@components/Spinner";

interface MoreContentProps {
  navigation: any;
  route: any;
}

export default function MoreContent({ navigation, route }: MoreContentProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);

  useEffect(() => {
    const fetch = async (id: number) => {
      setLoading(true);
      const { data } = await fetchLessonByCategory(id);
      setLessons(data);
      setLoading(false);
    };

    if (route.params.id) {
      fetch(route.params.id);
    }
    navigation.setOptions({
      title: route.params.title,
    });
  }, [route]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          family="Feather"
          name="filter"
          onPress={() => toggleFilter()}
        />
      ),
    });
  }, []);

  const toggleFilter = () => {
    setFilterVisible(!filterVisible);
  };

  const onSearch = async (filters?: any) => {
    const option = route.params.id
      ? {
          ...filters,
          category: [route.params.id],
        }
      : filters;

    const { success, data, message } = await searchLesson(option);

    if (success && data) {
      console.log("search", data);
      setLessons(data);
    } else {
      toast.show({
        description: message,
        isClosable: false,
        placement: "top",
        duration: 2000,
      });
    }
  };

  const renderEmpty = () => (
    <Center flex={1} backgroundColor="white" height={Layout.scaleHeight(80)}>
      <Text>{t("EMPTY_CONTENT")}</Text>
    </Center>
  );

  const renderBookListItem = ({
    item,
    index,
  }: {
    item: LessonItem;
    index: number;
  }) => (
    <BookListItem
      title={item.title}
      desc={item.desc}
      collection={item.lesson_collection}
      author={item.author}
      imageSource={item.thumbnail}
      price={item.product?.price}
      onPress={() => navigation.navigate(ROUTES.LESSON_INTRO, { id: item.id })}
      isFirst={index === 0}
      hidePrice
    />
  );

  return (
    <>
      {loading ? (
        <Spinner animating />
      ) : (
        <FlatList
          data={lessons}
          keyExtractor={(item) => `${item.id}`}
          showsVerticalScrollIndicator={false}
          renderItem={renderBookListItem}
          ListEmptyComponent={renderEmpty}
          backgroundColor="white"
          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: 100,
          }}
        />
      )}

      <FilterModal
        isVisible={filterVisible}
        onBackdropPress={toggleFilter}
        onConfirm={onSearch}
        hideCategory
      />
    </>
  );
}
