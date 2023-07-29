import React from "react";
import Modal from "react-native-modal";
import { Box, Button, Divider, HStack, useToast } from "native-base";

import Layout from "@styles/Layout";
import { t } from "@utils/i18n";
import ROUTES from "@navigation/Routes";
import { navigate } from "@navigation/index";
import { useAppDispatch } from "@hooks/redux";
import { connect } from "@actions/authAction";
import AppleButton from "@components/Buttons/AppleButton";
import FacebookButton from "@components/Buttons/FacebookButton";
import GoogleButton from "@components/Buttons/GoogleButton";
import LabelButton from "@components/LabelButton";

interface BottomSheetProps {
  isVisible: boolean;
  onBackdropPress: () => void;
}

export default function BottomSheet({
  isVisible,
  onBackdropPress,
}: BottomSheetProps) {
  const toast = useToast();
  const dispatch = useAppDispatch();

  const navigateTo = (route: string) => {
    onBackdropPress();
    setTimeout(() => {
      navigate(route);
    }, 500);
  };

  const navigateToHome = () => {
    navigate(ROUTES.HOME_TAB);
  };

  const handleSocialLogin = async (data: {
    provider: string;
    token: string;
  }) => {
    onBackdropPress();

    if (data.token) {
      const result = await dispatch(
        connect({ token: data.token, provider: data.provider })
      );
      console.log(result);

      if (result.authenticated) {
        navigateToHome();
      } else {
        toast.show({
          description: result.error,
          status: "error",
          isClosable: true,
        });
      }
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}
      backdropOpacity={0.2}
    >
      <Box
        _light={{ bg: "white" }}
        _dark={{ bg: "coolGray.800" }}
        alignSelf="center"
        position="absolute"
        bottom={-20}
        borderTopRadius={28}
        width={Layout.scaleWidth(100)}
        minHeight={200}
        padding={10}
      >
        <Button
          // @ts-ignore
          variant="primary"
          mb={4}
          onPress={() => navigateTo(ROUTES.SIGNUP)}
        >
          {t("Signup")}
        </Button>

        <HStack justifyContent="space-between" alignSelf="center" width="50%">
          <GoogleButton onPress={handleSocialLogin} />
          <AppleButton onPress={handleSocialLogin} />
          <FacebookButton onPress={handleSocialLogin} />
        </HStack>

        <Box alignItems="center">
          <Divider mt={5} mb={3} width="60%" />

          <LabelButton fontSize="sm" onPress={() => navigateTo(ROUTES.LOGIN)}>
            {t("moveToLogin")}
          </LabelButton>
        </Box>
      </Box>
    </Modal>
  );
}
