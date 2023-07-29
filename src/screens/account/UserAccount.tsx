import React, { useLayoutEffect, useState } from "react";
import { Text, Button, Box, Image, ScrollView } from "native-base";
import { LoginManager } from "react-native-fbsdk-next";

import IconButton from "@components/IconButton";
import { List } from "@components/List";
import { t } from "@utils/i18n";
import ROUTES from "@navigation/Routes";
import AlertModal from "@components/Modal/AlertModal";
import InviteModal from "@components/Mission/InviteModal";
import UserInfoBox from "@components/User/UserInfoBox";
import BrandFooter from "@components/BrandFooter";
import { getProfile } from "@selectors/authSelector";
import { useDispatch, useSelector } from "react-redux";
import { deleteAccount, logout } from "@actions/authAction";
import { useAppSelector } from "@hooks/redux";
import { getConfigState } from "@store/selectors/configSelector";
import { openLink } from "@utils/link";
import { EXP, logEvent } from "@utils/expLogger";

interface UserAccountProps {
  navigation: any;
}

export default function UserAccount({ navigation }: UserAccountProps) {
  const appConfig = useAppSelector(getConfigState);
  const [alertVisible, setAlertVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  
  const [promptVisible, setPromptVisible] = useState(false);
  const profile = useSelector(getProfile);
  const dispatch = useDispatch();
  console.log(profile, 'profile')
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton
          family="Feather"
          name="message-square"
          onPress={() => navigation.navigate(ROUTES.CHAT)}
        />
      ),
    });
  }, []);

  const onOpenLink = (url: string) => {
    openLink(url);

    const expType = (shareUrl: string) => {
      switch (shareUrl) {
        case appConfig.WHATSAPP:
          return EXP.SHARE;
        case appConfig.IG:
          return EXP.INSTAGRAM;
        case appConfig.FB:
          return EXP.FACEBOOK;
        case appConfig.YT:
          return EXP.YOUTUBE;
        default:
          return 0;
      }
    };

    logEvent(expType(url));
  };

  const onEditProfile = () => {
    navigation.navigate(ROUTES.EDIT_PROFILE);
  };

  const toggleAlert = () => {
    setAlertVisible(!alertVisible);
  };

  const onLogout = async () => {
    toggleAlert();
    // to allow multiple account
    if (profile.provider === "facebook") {
      await LoginManager.logOut();
    }
    await dispatch(logout());
    navigation.reset({ index: 0, routes: [{ name: ROUTES.LANDING }] });
  };
  const onDeleteAccount = async () => {
    setDeleteVisible(false)

    await dispatch(deleteAccount(profile?.id))
    navigation.reset({ index: 0, routes: [{ name: ROUTES.LANDING }] });
  }
  return (
    <ScrollView showsVerticalScrollIndicator={false} flex={1} p={5}>
      <UserInfoBox profile={profile} onEditProfile={() => onEditProfile()} />
      <Box mt={10}>
        <List mt={2} shadow={1}>
          <List.Item
            icon="inbox"
            isFirst
            onPress={() => navigation.navigate(ROUTES.PURCHASE_RECORD)}
          >
            {t("Purchase Record")}
          </List.Item>
          <List.Item
            icon="bookmark"
            onPress={() => navigation.navigate(ROUTES.BOOKMARK)}
          >
            {t("Bookmark")}
          </List.Item>
          <List.Item
            icon="bell"
            onPress={() => navigation.navigate(ROUTES.NOTIFICATION_SETTINGS)}
          >
            {t("Push Notifications")}
          </List.Item>
          <List.Item
            icon="share"
            hideRightIcon
            onPress={() => setPromptVisible(true)}
          >
            {t("INVITE_TITLE")}
          </List.Item>
          <List.Item
            icon="message-square"
            onPress={() => navigation.navigate(ROUTES.CHAT)}
          >
            {t("CONTACT_CS")}
          </List.Item>
          <List.Item
            icon="sun"
            onPress={() => navigation.navigate(ROUTES.THEME_SETTINGS)}
            isLast
          >
            {t("THEME")}
          </List.Item>
          <List.Item
            icon="trash-2"
            onPress={() => setDeleteVisible(true)}
            isLast
            hideRightIcon
          >
            {t("Delete Account")}
          </List.Item>
          <List.Item
            icon="book"
            onPress={() => navigation.navigate(ROUTES.TERMS_AND_CONDITIONS)}
            isLast
            hideRightIcon
          >
            {t("Terms and Conditions")}
          </List.Item>
        </List>

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
            onPress={() => onOpenLink(appConfig.WHATSAPP)}
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
            onPress={() => onOpenLink(appConfig.IG)}
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
            onPress={() => onOpenLink(appConfig.FB)}
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
            onPress={() => onOpenLink(appConfig.YT)}
          >
            {t("JOIN_YT")}
          </List.Item>
        </List>
      </Box>
      <Box justifyContent="space-between" alignItems="center" mt={10} mb={10}>
        <Button
          // @ts-ignore
          variant="secondary"
          shadow={0}
          px={45}
          onPress={() => toggleAlert()}
        >
          {t("Logout")}
        </Button>
      </Box>
      <BrandFooter />
      <AlertModal
        isVisible={deleteVisible}
        onBackdropPress={() =>setDeleteVisible(false)}
        title={t("Delete Account")}
        message={t("ARE_YOU_SURE_TO_DELETE_YOUR_ACCOUNT")}
        buttons={[
          {
            label: t("Yes"),
            onPress: () => onDeleteAccount(),
          },
          {
            label: t("No"),
            onPress: () => setDeleteVisible(false),
          },
        ]}
      />
      <AlertModal
        isVisible={alertVisible}
        onBackdropPress={toggleAlert}
        title={t("Logout")}
        message={t("LOGOUT_PROMPT")}
        buttons={[
          {
            label: t("Yes"),
            onPress: () => {
              toggleAlert();
              onLogout();
            },
          },
          {
            label: t("No"),
            onPress: () => toggleAlert(),
          },
        ]}
      />
      <InviteModal
        isVisible={promptVisible}
        onBackdropPress={() => setPromptVisible(false)}
      />
    </ScrollView>
  );
}
