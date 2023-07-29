import { Alert } from "react-native";
import * as Linking from "expo-linking";
import { t } from "./i18n";

export const openLink = async (url: string) => {
  const supported = await Linking.canOpenURL(url);

  if (supported) {
    await Linking.openURL(url);
  } else {
    Alert.alert(t("OPEN_LINK_ERROR"));
  }
};
