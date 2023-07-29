import React, { useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import { Text, Center, ScrollView } from "native-base";

import ROUTES from "@navigation/Routes";
import { t } from "@utils/i18n";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { fetchFreeContent } from "@actions/lessonAction";
import { getFreeData } from "@store/selectors/lessonSelector";
import { getConfigState } from "@store/selectors/configSelector";
import IconButton from "@components/IconButton";
import { List } from "@components/List";
import { LessonItem } from "@store/states/LessonState";
import BookCard from "@components/LessonCard/BookCard";
import Section from "@components/Container/Section";
import ListSection from "@components/Container/ListSection";
import ArticleCard from "@components/Free/ArticleListItem";
import NoteListItem from "@components/Free/NoteListItem";
import VideoPreview from "@components/Free/VideoPreview";
import PromoCard from "@components/IndexSpecific/PromoCard";
import Spinner from "@components/Spinner";
import { openLink } from "@utils/link";

interface FreeContentProps {
  navigation: any;
  route: any;
}

type SectionItem = { item: LessonItem; index: number };

export default function FreeContent({ navigation, route }: FreeContentProps) {
  const appConfig = useAppSelector(getConfigState);
  const freeData = useAppSelector(getFreeData);
  const dispatch = useAppDispatch();
  const [sections, setSections] = useState<any>([]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: t("FreeContent"),
    });
    onRefresh();
  }, []);

  useEffect(() => {
    const formatData = (data: any) => {
      const sectionData = Object.entries(data)
        .filter((arr) => typeof arr[1] === "object")
        // @ts-ignore
        .map((ent) => ({ type: ent[0], ...ent[1] }))
        .sort((a, b) => {
          if (a.order && b.order) {
            return b.order - a.order;
          }
          return 0;
        });
      setSections(sectionData);
    };

    if (freeData) {
      formatData(freeData);
    }
  }, [freeData]);

  const onRefresh = async () => {
    dispatch(fetchFreeContent());
  };

  const onViewLesson = (lesson: LessonItem) => {
    navigation.navigate(ROUTES.LESSON_INTRO, { id: lesson.id });
  };

  const onViewList = (item: any, title?: string) => {
    navigation.navigate(ROUTES.NEWS_DETAIL, {
      id: item.id,
      data: item,
      title,
    });
  };

  const ShareSection = () => (
    <List mt={8} shadow={1}>
      <List.Item
        isFirst
        hideRightIcon
        renderLeftIcon={() => (
          <IconButton
            family="MaterialCommunityIcons"
            name="whatsapp"
            disabled
          />
        )}
        onPress={() => openLink(appConfig.WHATSAPP)}
      >
        {t("JOIN_WHATSAPP")}
      </List.Item>
      <List.Item
        hideRightIcon
        renderLeftIcon={() => (
          <IconButton
            family="MaterialCommunityIcons"
            name="instagram"
            disabled
          />
        )}
        onPress={() => openLink(appConfig.IG)}
      >
        {t("JOIN_IG")}
      </List.Item>
      <List.Item
        hideRightIcon
        renderLeftIcon={() => (
          <IconButton
            family="MaterialCommunityIcons"
            name="facebook"
            disabled
          />
        )}
        onPress={() => openLink(appConfig.FB)}
      >
        {t("JOIN_FB")}
      </List.Item>
      <List.Item
        isLast
        hideRightIcon
        renderLeftIcon={() => (
          <IconButton family="MaterialCommunityIcons" name="youtube" disabled />
        )}
        onPress={() => openLink(appConfig.YT)}
      >
        {t("JOIN_YT")}
      </List.Item>
    </List>
  );

  const renderSectionItem = (type: string, item: any) => {
    if (type === "notes") {
      return (
        <NoteListItem
          key={`${item.title}-${item.id}`}
          title={item.title}
          imageSource={item.banner}
          onPress={() => onViewList(item, freeData?.notes.title)}
        />
      );
    } else if (type === "videos") {
      return (
        <VideoPreview
          key={`${item.title}-${item.id}`}
          title={item.title}
          imageSource={item.thumbnail}
          onPress={() => onViewLesson(item)}
          category={item.category}
          author={item.author}
        />
      );
    }
    return (
      <BookCard
        key={`${item.title}-${item.id}`}
        title={item.title}
        desc={item.desc}
        collection={item.lesson_collection}
        duration={item.duration_total}
        category={item.category}
        imageSource={item.thumbnail}
        onPress={() => onViewLesson(item)}
      />
    );
  };

  if (sections) {
    return (
      <ScrollView
        _contentContainerStyle={{ pt: 5, mx: 5, pb: 10 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        }
      >
        {<Spinner animating={sections.length === 0} />}

        {sections.map(
          (section: { data: any[]; title: string; type: string }) => {
            if (section.type === "articles") {
              return (
                <ListSection
                  key={section.title}
                  data={section.data}
                  title={section.title}
                  renderItem={({ item, index }: any) => (
                    <ArticleCard
                      key={`${section.type}-${item.id}`}
                      title={item.title}
                      desc={item.content}
                      imageSource={item.banner}
                      onPress={() => onViewList(item, section.title)}
                      isFirst={index === 0}
                    />
                  )}
                />
              );
            }
            return (
              <Section
                key={section.title}
                data={section.data}
                title={section.title}
                renderItem={({ item }: SectionItem) =>
                  renderSectionItem(section.type, item)
                }
              />
            );
          }
        )}

        {route.params?.subscription_cta && (
          <PromoCard
            imageSource={route.params.subscription_cta.image}
            title={route.params.subscription_cta.title}
            subtitle={route.params.subscription_cta.subtitle}
            backgroundColor={route.params.subscription_cta.backgroundColor}
            textColor={route.params.subscription_cta.textColor}
            onPress={() =>
              navigation.navigate(ROUTES.ACCOUNT_TAB, {
                initial: false,
                screen: ROUTES.MEMBERSHIP_PLAN,
              })
            }
          />
        )}
        <ShareSection />
      </ScrollView>
    );
  }
  return (
    <Center flex={1} pt={100} bgColor="white">
      <Text>{t("EMPTY_CONTENT")}</Text>
    </Center>
  );
}
