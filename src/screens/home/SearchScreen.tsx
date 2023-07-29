import React, { useEffect, useState } from "react";
import { Center, FlatList, useToast, View, Text } from "native-base";
import { useSelector } from "react-redux";

import ROUTES from "@navigation/Routes";
import { getNewLessons } from "@store/selectors/lessonSelector";
import { LessonItem } from "@store/states/LessonState";
import BookListItem from "@components/LessonCard/BookListItem";
import SearchListItem from "@components/LessonCard/SearchListItem";
import SearchBar from "@components/Search/SearchBar";
import FilterModal from "@components/Search/FilterModal";
import { searchLesson } from "@data-fetch/lesson";
import { t } from "@utils/i18n";

interface SearchScreenProps {
  navigation: any;
  route: any;
}

export default function SearchScreen({ navigation, route }: SearchScreenProps) {
  const toast = useToast();
  const newLessons = useSelector(getNewLessons);
  const [keyword, setKeyword] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [isDefault, setDefault] = useState(true);
  const [result, setResult] = useState([]);

  useEffect(() => {
    if (keyword === "") {
      setDefault(true);
    }
  }, [keyword]);

  useEffect(() => {
    if (route.params && route.params.filters) {
      onSearch(route.params.filters);
    }
  }, [route]);

  const toggleFilter = () => {
    setFilterVisible(!filterVisible);
  };

  const onSearch = async (filters?: any) => {
    setDefault(false);
    const option = filters ? filters : { keyword };
    const { success, data, message } = await searchLesson(option);

    if (success && data) {
      console.log("search", data);
      setResult(data);
    } else {
      toast.show({
        description: message,
        isClosable: false,
        placement: "top",
        duration: 2000,
      });
    }
  };

  const renderDefaultItem = ({ item }: { item: LessonItem }) => (
    <SearchListItem
      title={item.title}
      createdAt={""}
      imageSource={item.thumbnail}
      onPress={() => {
        navigation.navigate(ROUTES.LESSON_TAB, {
          screen: ROUTES.VIDEO_LESSON,
          params: { id: item.id },
        });
      }}
    />
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
    />
  );

  const renderEmpty = () => {
    if (keyword && !isDefault && result.length === 0) {
      return (
        <Center flex={1} pt={220}>
          <Text>{t("EMPTY_CONTENT")}</Text>
        </Center>
      );
    }
    return null;
  };

  return (
    <View flex={1} _light={{ bg: "white" }} _dark={{ bg: "coolGray.900" }}>
      <SearchBar
        value={keyword}
        onChangeText={(val) => setKeyword(val)}
        onPressFilter={toggleFilter}
        onSearch={onSearch}
      />

      <FlatList
        data={isDefault ? newLessons : result}
        keyExtractor={(item) => `${item.id}`}
        renderItem={isDefault ? renderDefaultItem : renderBookListItem}
        ListEmptyComponent={renderEmpty}
      />
      <FilterModal
        isVisible={filterVisible}
        onBackdropPress={toggleFilter}
        onConfirm={onSearch}
      />
    </View>
  );
}
