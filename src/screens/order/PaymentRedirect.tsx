import React from "react";
import { StyleSheet } from "react-native";
import {
  WebView,
  WebViewMessageEvent,
  WebViewNavigation,
} from "react-native-webview";
import { useToast } from "native-base";

import { useAppSelector } from "@hooks/redux";
import { getProfile } from "@selectors/authSelector";
import ROUTES from "@navigation/Routes";
import useToken from "@hooks/useToken";
import { WEB_APP } from "@constants/links";
import { t } from "@utils/i18n";

interface Props {
  navigation: any;
  route: any;
}

export default function WebPayment({ navigation, route }: Props) {
  const profile = useAppSelector(getProfile);
  const token = useToken();
  const toast = useToast();
  const tier = route.params?.tier || "T3";
  const { id, username, email, avatar, phone } = profile;

  const setLocalStorage = `(function() {
    window.localStorage.setItem('btv-auth', ${token});
    window.localStorage.setItem('btv-user', ${JSON.stringify({
      id,
      username,
      email,
      avatar,
      phone,
    })});
  })();`;

  const onMessage = (e: WebViewMessageEvent) => {
    console.log("message", e.nativeEvent.data);
  };

  const onNavigationStateChange = (navState: WebViewNavigation) => {
    console.log("navState", navState);

    if (navState.url.includes("success")) {
      setTimeout(() => {
        navigation.navigate(ROUTES.PURCHASE_RECORD, { refetch: true });
      }, 3000);
    } else if (navState.url.includes("canceled")) {
      toast.show({
        description: t("PURCHASE_CANCEL"),
        isClosable: false,
        duration: 3000,
      });
      setTimeout(() => {
        navigation.goBack();
      }, 3000);
    }
  };

  return (
    <WebView
      style={styles.container}
      source={{
        uri: `${WEB_APP}/checkout?product=${tier}&redirect_token=${token}`,
      }}
      injectedJavaScriptBeforeContentLoaded={setLocalStorage}
      onMessage={onMessage}
      onNavigationStateChange={onNavigationStateChange}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
