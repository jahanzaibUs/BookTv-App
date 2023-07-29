import React, { useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import { FlatList } from "native-base";

import HeroImage from "@components/IndexSpecific/HeroImage";
import NewsCard from "@components/News/NewsCard";
import { NewsItem } from "@store/states/NewsState";
import { getConfigState } from "@store/selectors/configSelector";
import ROUTES from "@navigation/Routes";
import { useAppSelector } from "@hooks/redux";
import { fetchNews } from "@data-fetch/news";

interface NewsIndexProps {
  navigation: any;
}

export default function NewsIndex({ navigation }: NewsIndexProps) {
  const [banner, setBanner] = useState("");
  const [news, setNews] = useState([]);
  const appConfig = useAppSelector(getConfigState);

  useEffect(() => {
    onRefresh();
  }, []);

  useEffect(() => {
    if (appConfig.news_banner) {
      setBanner(appConfig.news_banner.url);
    } else {
      setBanner("");
    }
  }, [appConfig.news_banner]);

  const onRefresh = async () => {
    const newsRes = await fetchNews();

    if (newsRes.success) {
      setNews(newsRes.data);
    }
  };

  const renderItem = ({ item, index }: { item: NewsItem; index: number }) => (
    <NewsCard
      title={item.title}
      content={item.content}
      imageSource={item.banner}
      createdAt={item.created_at}
      isFirst={index === 0}
      onPress={() =>
        navigation.navigate(ROUTES.NEWS_DETAIL, {
          id: item.id,
          data: item,
        })
      }
    />
  );

  const renderBanner = () => {
    if (banner) {
      return <HeroImage imageSource={banner} />;
    }
    return null;
  };

  return (
    <FlatList
      data={news}
      keyExtractor={(item) => `${item.id}`}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={onRefresh} />
      }
      ListHeaderComponent={renderBanner}
      renderItem={renderItem}
      contentContainerStyle={{
        paddingBottom: 30,
        alignItems: "center",
      }}
    />
  );
}
