import React, { useEffect } from "react";
import * as Linking from "expo-linking";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NativeBaseProvider } from "native-base";

import { colorModeManager } from "@screens/account/ThemeSetting";
import AuthSheetWrapper from "@components/Modal/AuthSheetWrapper";
import { useAppDispatch } from "@hooks/redux";
import useCachedResources from "@hooks/useCachedResources";
import useNotifications from "@hooks/useNotifications";
import useToken from "@hooks/useToken";
import theme from "@styles/Theme";
import IAPManager from "@hooks/IAPManager";
import { fetchLessonConfig } from "@actions/lessonAction";
import { fetchAppConfig } from "@store/actions/configAction";
import { addNotification } from "@actions/notificationAction";
import { setI18nConfig } from "@utils/i18n";
import Navigation from "./src/navigation";

function AppCore() {
  const dispatch = useAppDispatch();
  const isLoadingComplete = useCachedResources();
  const { notification, response } = useNotifications();
  const token = useToken();

  useEffect(() => {
    setI18nConfig();
    handleInitLink();
    addLinkingListener();
    fetchData();

    return () => {
      removeLinkingListener();
    };
  }, []);

  useEffect(() => {
    if (notification) {
      dispatch(addNotification(notification));
    }
  }, [notification]);

  useEffect(() => {
    const url = response?.request.content.data.url as string;
    if (url) {
      Linking.openURL(url);
    }
  }, [response]);

  const fetchData = async () => {
    await Promise.all([
      dispatch(fetchAppConfig()),
      dispatch(fetchLessonConfig()),
    ]);
  };

  // If app not open
  const handleInitLink = async () => {
    const initUrl = await Linking.getInitialURL();
    if (initUrl) {
      handleRedirect(initUrl);
    }
  };

  const handleRedirect = (url: string) => {
    let data = Linking.parse(url);
    console.log("Redirect", data);
  };

  // App is already open
  const addLinkingListener = () => {
    Linking.addEventListener("url", (e) => handleRedirect(e.url));
  };

  const removeLinkingListener = () => {
    Linking.removeEventListener("url", (e) => handleRedirect(e.url));
  };

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <IAPManager>
        <NativeBaseProvider theme={theme} colorModeManager={colorModeManager}>
          <SafeAreaProvider>
            <Navigation authenticated={!!token} />
            <AuthSheetWrapper />
          </SafeAreaProvider>
        </NativeBaseProvider>
      </IAPManager>
    );
  }
}

export default AppCore;
