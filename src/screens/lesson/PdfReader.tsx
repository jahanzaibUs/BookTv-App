import React, { useEffect } from "react";
import { Alert } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import PDFReader from "rn-pdf-reader-js";
import { HeaderBackButton } from "@react-navigation/stack";

import { getFileUrl } from "@utils/file";
import ROUTES from "@navigation/Routes";

interface PDFProps {
  navigation: any;
  route: any;
}

export default function PDF({ navigation, route }: PDFProps) {
  useEffect(() => {
    enableLandscape();
    navigation.setOptions({
      headerLeft: (props: any) => (
        <HeaderBackButton {...props} onPress={() => goBack()} />
      ),
    });

    return () => {
      disableLandscape();
    };
  }, []);

  const goBack = () => {
    navigation.goBack();
  };

  const enableLandscape = async () => {
    await ScreenOrientation.unlockAsync();
  };

  const disableLandscape = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
  };

  const onError = () => {
    Alert.alert("Cannot load file");
  };

  return (
    <PDFReader
      source={{
        uri: getFileUrl(route.params.url),
      }}
      withPinchZoom
      onError={onError}
    />
  );
}
