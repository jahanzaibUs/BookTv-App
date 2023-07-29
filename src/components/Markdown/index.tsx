import { StyleSheet } from "react-native";
import Markdown from "react-native-markdown-display";
import { useNavigation } from "@react-navigation/native";

import ROUTES from "@navigation/Routes";
import { useColorMode } from "native-base";

const darkStyles = StyleSheet.create({
  body: {
    paddingVertical: 10,
  },
  heading1: {
    color: "white",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
  },
  heading2: {
    color: "white",
    fontSize: 20,
    fontWeight: "500",
  },
  heading3: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
  heading4: {
    color: "white",
    fontSize: 16,
  },
  heading5: {
    color: "white",
    fontSize: 13,
  },
  heading6: {
    color: "white",
    fontSize: 12,
  },
  link: {
    color: "#FF7500",
    textDecorationLine: "none",
  },
  paragraph: {
    color: "white",
    lineHeight: 24,
    fontSize: 17,
    marginBottom: 24,
  },
  blockquote: {
    marginBottom: 24,
    backgroundColor: "transparent",
  },
});

const markdownStyles = StyleSheet.create({
  body: {
    paddingVertical: 10,
  },
  heading1: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
  },
  heading2: {
    fontSize: 20,
    fontWeight: "500",
  },
  heading3: {
    fontSize: 18,
    fontWeight: "500",
  },
  heading4: {
    fontSize: 16,
  },
  heading5: {
    fontSize: 13,
  },
  heading6: {
    fontSize: 12,
  },
  link: {
    color: "#FF7500",
    textDecorationLine: "none",
  },
  paragraph: {
    lineHeight: 24,
    fontSize: 17,
    marginBottom: 24,
  },
  blockquote: {
    marginBottom: 24,
  },
});

interface Props {
  children: string;
  fromId?: number;
}

export default function MarkdownDisplay({ children, fromId }: Props) {
  const { colorMode } = useColorMode();
  const navigation = useNavigation();

  const onLinkPress = (url: string) => {
    // return false to override
    const lessonRegex = /lessons\/(\d*)/;
    const lessonLinks = url.match(lessonRegex);

    if (lessonLinks) {
      navigation.navigate(ROUTES.LESSON_TAB, {
        screen: ROUTES.VIDEO_LESSON,
        params: { id: lessonLinks[1] },
      });
      return false;
    }

    // const isGoogleForm = url.includes("forms.gle");
    // if (isGoogleForm) {
    //   navigation.navigate(ROUTES.WEB_PAYMENT, { id: fromId });
    //   return false;
    // }

    // return true to open with `Linking.openURL`
    return true;
  };

  return (
    <Markdown
      style={colorMode === "dark" ? darkStyles : markdownStyles}
      onLinkPress={onLinkPress}
    >
      {children}
    </Markdown>
  );
}
