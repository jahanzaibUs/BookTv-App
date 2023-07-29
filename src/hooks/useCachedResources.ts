import * as React from "react";
import { Feather } from "@expo/vector-icons";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Asset } from "expo-asset";

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        const cacheFonts = Font.loadAsync({
          ...Feather.font,
        });

        // Preload images
        const images = [
          require("@assets/images/icon-transparent.png"),
          require("@assets/images/storytelling.png"),
        ];
        const cacheImages = images.map((image) => {
          return Asset.fromModule(image).downloadAsync();
        });

        await Promise.all([...cacheImages, cacheFonts]);
      } catch (e) {
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
