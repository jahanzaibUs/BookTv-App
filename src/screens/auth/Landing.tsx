import React, { useLayoutEffect } from "react";
import { ImageBackground, SafeAreaView } from "react-native";
import {
  Button,
  Heading,
  Box,
  View,
  Image,
  HStack,
  useToast,
} from "native-base";

import { imageData } from "@constants/media";
import { t } from "@utils/i18n";
import Layout from "@styles/Layout";
import ROUTES from "@navigation/Routes";
import { useAppDispatch } from "@hooks/redux";
import { connect } from "@actions/authAction";
import LabelButton from "@components/LabelButton";
import AppleButton from "@components/Buttons/AppleButton";
import FacebookButton from "@components/Buttons/FacebookButton";
import GoogleButton from "@components/Buttons/GoogleButton";

interface LandingProps {
  navigation: any;
}

export default function Landing({ navigation }: LandingProps) {
  const toast = useToast();
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRightContainerStyle: {
        paddingHorizontal: Layout.space,
      },
      headerTransparent: true,
      title: "",
      headerRight: () => (
        <LabelButton onPress={navigateToHome} color="black">
          {t("Skip")}
        </LabelButton>
      ),
    });
  }, []);

  const navigateToHome = () => {
    navigation.replace(ROUTES.ROOT);
  };

  const handleSocialLogin = async (data: {
    provider: string;
    token: string;
  }) => {
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
          duration: 5000,
        });
      }
    }
  };

  const navigateTo = (route: string) => {
    navigation.navigate(route);
  };

  return (
    <ImageBackground
      source={imageData.splash}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box alignItems="center" mt={12}>
          <HStack alignItems="center">
            <Image
              source={require("@assets/images/icon.png")}
              alt="booktv_logo"
              size="sm"
              borderRadius={10}
              mr={4}
            />
            <Heading fontSize="4xl" lineHeight={10} color="black">
              {t("APP_NAME")}
            </Heading>
          </HStack>
          <Heading
            color="black"
            fontSize="sm"
            maxWidth={190}
            lineHeight={5}
            textAlign="center"
            mt={5}
          >
            {t("SIGNUP_PROMPT")}
          </Heading>
        </Box>

        <View width="90%" mb={6}>
          {/* <Button
            // @ts-ignore
            variant="secondary2"
            mb={4}
            onPress={() => navigateTo(ROUTES.SIGNUP)}
          >
            {t("Signup")}
          </Button> */}
          {/* @ts-ignore */}
          {/* <Button variant="secondary2" onPress={() => navigateTo(ROUTES.LOGIN)}>
            {t("Login")}
          </Button> */}

          <View
            alignSelf="center"
            width="50%"
            flexDirection="row"
            justifyContent="space-between"
            mt={6}
          >
            <GoogleButton onPress={handleSocialLogin} />
            <AppleButton onPress={handleSocialLogin} />
            <FacebookButton onPress={handleSocialLogin} />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
