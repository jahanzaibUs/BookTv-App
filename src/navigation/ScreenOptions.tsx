import { useColorMode } from "native-base";

import Layout from "@styles/Layout";

type HeaderTitleAlign = "left" | "center";

export const withoutBorderStyle = {
  shadowColor: "transparent",
  elevation: 0,
};

export const getScreenOptions = () => {
  const { colorMode } = useColorMode();

  return {
    headerBackTitleVisible: false,
    headerStyle: {
      backgroundColor: colorMode === "dark" ? "#111827" : "#fff",
      ...withoutBorderStyle,
    },
    headerTintColor: colorMode === "dark" ? "#fff" : "#000000",
    headerTitleAlign: "center" as HeaderTitleAlign,
    headerTitleStyle: {
      fontSize: 16,
    },
    headerLeftContainerStyle: {
      paddingHorizontal: Layout.space,
    },
    headerRightContainerStyle: {
      paddingHorizontal: Layout.space,
    },
  };
};

export const authScreenOptions = {
  headerShown: true,
  headerStyle: withoutBorderStyle,
};
