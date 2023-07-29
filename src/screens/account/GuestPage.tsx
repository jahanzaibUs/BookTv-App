import React from "react";
import {
  ScrollView,
  HStack,
  Heading,
  Box,
  Avatar,
  Image,
  Text,
} from "native-base";

import { List } from "@components/List";
import { t } from "@utils/i18n";
import ROUTES from "@navigation/Routes";
import IconButton from "@components/IconButton";
import BrandFooter from "@components/BrandFooter";
import { onShare } from "@utils/share";
import { openLink } from "@utils/link";
import { useAppSelector } from "@hooks/redux";
import { getConfigState } from "@store/selectors/configSelector";

interface Props {
  navigation: any;
}

export default function GuestPage({ navigation }: Props) {
  const appConfig = useAppSelector(getConfigState);

  const goToSignup = () => {
    navigation.navigate(ROUTES.SIGNUP);
  };

  const goToLogin = () => {
    navigation.navigate(ROUTES.LOGIN);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
      p={5}
    >
      <HStack alignItems="center">
        <Avatar
          source={require("@assets/images/avatar-placeholder.jpg")}
          size="lg"
          shadow={1}
        />
        <Box px={4}>
          <Heading fontSize="2xl" fontWeight={500}>
            {t("Guest")}
          </Heading>
        </Box>
      </HStack>

      <List mt={10} shadow={1}>
        <List.Item
          isFirst
          icon="user"
          hideRightIcon
          onPress={() => goToLogin()}
        >
          {t("Login")}
        </List.Item>
        <List.Item icon="book" hideRightIcon onPress={() => goToSignup()}>
          {t("JOIN_US")}
        </List.Item>

        <List.Item
          hideRightIcon
          icon="message-square"
          onPress={() => openLink(appConfig.WHATSAPP)}
        >
          {t("CONTACT_US")}
        </List.Item>

        <List.Item
          icon="sun"
          onPress={() => navigation.navigate(ROUTES.THEME_SETTINGS)}
          isLast
        >
          {t("THEME")}
        </List.Item>
      </List>

      <List mt={10} shadow={1}>
        <List.Item
          isFirst
          hideRightIcon
          renderLeftIcon={() => (
            <IconButton
              family="MaterialCommunityIcons"
              name="share-variant"
              disabled
            />
          )}
          onPress={() => onShare({})}
        >
          {t("Share")}
        </List.Item>

        <List.Item
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
            <IconButton
              family="MaterialCommunityIcons"
              name="youtube"
              disabled
            />
          )}
          onPress={() => openLink(appConfig.YT)}
        >
          {t("JOIN_YT")}
        </List.Item>
      </List>

      <BrandFooter />
    </ScrollView>
  );
}
