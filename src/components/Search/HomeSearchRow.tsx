import React from "react";
import {
  HStack,
  Pressable,
  Text,
  Icon,
  Image,
  useColorModeValue,
} from "native-base";
import { Feather } from "@expo/vector-icons";

import { t } from "@utils/i18n";
import IconButton from "@components/IconButton";

interface HomeSearchRowProps {
  onPressSearch?: () => void;
  onPressLeft?: () => void;
  onPressRight?: () => void;
  hideExp?: boolean;
  unreadCount?: number;
}

export default function HomeSearchRow({
  onPressSearch,
  onPressRight,
  onPressLeft,
  hideExp = true,
  unreadCount = 0,
}: HomeSearchRowProps) {
  const bgColor = useColorModeValue("trueGray.100", "coolGray.600");
  const textColor = useColorModeValue("trueGray.400", "white");

  return (
    <HStack pb={2} px={5} justifyContent="space-between" alignItems="center">
      <Image
        source={require("@assets/images/icon-transparent.png")}
        alt="logo"
        size="xs"
        mr={2}
      />

      <Pressable
        bg={bgColor}
        borderRadius={20}
        flex={1}
        minHeight="40px"
        py={2}
        px={5}
        flexDirection="row"
        onPress={onPressSearch}
      >
        <Icon
          as={<Feather name="search" />}
          size="sm"
          color="trueGray.300"
          mr={2}
        />
        <Text fontSize={14} color={textColor}>
          {t("SEARCH_PLACEHOLDER")}
        </Text>
      </Pressable>

      <IconButton
        family="Feather"
        name="mail"
        ml={2}
        badge={unreadCount}
        onPress={onPressLeft}
      />
      {!hideExp && (
        <IconButton
          family="Feather"
          name="gift"
          color="primary.600"
          ml={3}
          mb={1}
          onPress={onPressRight}
        />
      )}
    </HStack>
  );
}
