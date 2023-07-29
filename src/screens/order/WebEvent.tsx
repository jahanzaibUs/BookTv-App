import React from "react";
import { StyleSheet } from "react-native";
import {
  WebView,
  WebViewMessageEvent,
  WebViewNavigation,
} from "react-native-webview";
import { HeaderBackButton } from "@react-navigation/stack";

import ROUTES from "@navigation/Routes";

interface Props {
  navigation: any;
  route: any;
}

export default function WebEvent({ navigation, route }: Props) {
  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: route.params?.title || "",
    });
  }, []);

  const goBack = () => {
    navigation.navigate(ROUTES.EVENT_DETAIL, { formRes: true });
  };

  const onMessage = (e: WebViewMessageEvent) => {
    console.log("message", e.nativeEvent.data);
  };

  const onNavigationStateChange = (navState: WebViewNavigation) => {
    console.log("form", navState);

    if (navState.url.includes("formResponse")) {
      navigation.setOptions({
        headerLeft: (props: any) => (
          <HeaderBackButton {...props} onPress={() => goBack()} />
        ),
      });
    }
  };

  return (
    <WebView
      style={styles.container}
      source={{ uri: route.params?.link }}
      onMessage={onMessage}
      onNavigationStateChange={onNavigationStateChange}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
