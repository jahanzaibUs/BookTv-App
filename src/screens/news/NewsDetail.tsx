import React, { useEffect, useState } from "react";
import { ScrollView, View, HStack, Heading, Text } from "native-base";
import moment from "moment";

import { onShare } from "@utils/share";
import Spinner from "@components/Spinner";
import HeroImage from "@components/IndexSpecific/HeroImage";
import IconButton from "@components/IconButton";
import Markdown from "@components/Markdown";
import Layout from "@styles/Layout";
import { t } from "@utils/i18n";
import { logEvent, EXP } from "@utils/expLogger";
import { fetchNewsDetail } from "@data-fetch/news";

interface NewsDetailProps {
  navigation: any;
  route: any;
}

export default function NewsDetail({ navigation, route }: NewsDetailProps) {
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState({
    title: "",
    content: "",
    banner: { url: "", width: 1, height: 1 },
    created_at: "",
  });
  const { title, content, created_at, banner } = detail;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.title || t("News"),
    });
  }, [route]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data } = await fetchNewsDetail(route.params.id);
      if (data) {
        setDetail(data);
      }
      setLoading(false);
    };

    if (route.params && route.params.data) {
      setDetail(route.params.data);
    } else {
      fetch();
    }
  }, [route]);

  return (
    <ScrollView
      _contentContainerStyle={{
        flexGrow: 1,
        pb: 20,
      }}
    >
      <Spinner animating={loading} />
      {!!banner && (
        <HeroImage
          imageSource={banner.url}
          height={(banner.height / banner.width) * Layout.deviceWidth}
        />
      )}

      <View p={5}>
        <HStack justifyContent="space-between">
          <Heading fontSize="2xl" width={"90%"}>
            {title}
          </Heading>
          <IconButton
            family="Ionicons"
            name="share-social"
            onPress={() =>
              onShare({ message: title, newsId: route.params.id }, () =>
                logEvent(EXP.SHARE)
              )
            }
          />
        </HStack>
        {!!created_at && (
          <Text
            mt={2}
            _light={{ color: "gray.600" }}
            _dark={{ color: "white" }}
            fontSize="sm"
          >
            {moment(created_at).format("LLL")}
          </Text>
        )}
        <Markdown>{content}</Markdown>
      </View>
    </ScrollView>
  );
}
