import React from "react";
import { VStack, Text, Button, Icon, Center } from "native-base";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { t } from "@utils/i18n";
import ROUTES from "@navigation/Routes";

interface ContentWallProps {
  title?: string;
  content?: string;
  buttonLabel?: string;
  onPress?: () => void;
}

const ContentWall = ({
  title,
  content,
  buttonLabel,
  onPress,
}: ContentWallProps) => {
  const navigation = useNavigation();

  const redirectSignup = () => {
    navigation.navigate(ROUTES.SIGNUP);
  };

  return (
    <VStack
      _light={{ bg: "white" }}
      _dark={{ bg: "coolGray.900" }}
      flex={1}
      px={5}
      pb={4}
    >
      <Center flex={1}>
        <Icon
          as={<Feather name="book" />}
          size="4xl"
          color="primary.600"
          mb={10}
        />
        <Text fontWeight="500" fontSize="lg">
          {t(title || "SIGNUP_TITLE")}
        </Text>
        {!!content && <Text mt={2}>{t(content)}</Text>}
      </Center>

      <Button
        // @ts-ignore
        variant="primary"
        shadow={0}
        onPress={onPress || redirectSignup}
        mb={12}
      >
        {buttonLabel ? t(buttonLabel) : t("Signup")}
      </Button>
    </VStack>
  );
};

export default ContentWall;
