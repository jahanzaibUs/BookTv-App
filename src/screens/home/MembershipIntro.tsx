import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { View } from "native-base";

import { fetchMembershipIntro } from "@data-fetch/info";
import ROUTES from "@navigation/Routes";
import Markdown from "@components/Markdown";
import PromoCard from "@components/IndexSpecific/PromoCard";

const styles = StyleSheet.create({
  container: {
    height: "100%",
    paddingHorizontal: "5%",
  },
});

interface Props {
  navigation: any;
  route: any;
}

export default function MembershipIntro({ navigation, route }: Props) {
  const [markdown, setMarkdown] = useState(``);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await fetchMembershipIntro();
      if (data) {
        setMarkdown(data.content);
        navigation.setOptions({
          headerTitle: data.title || "",
        });
      }
    };

    fetch();
  }, []);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
    >
      <Markdown>{markdown}</Markdown>

      {route.params?.subscription_cta && (
        <View mb={10}>
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
        </View>
      )}
    </ScrollView>
  );
}
