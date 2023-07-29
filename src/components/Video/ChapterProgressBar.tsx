import React from "react";
import { Box, HStack, Text, Icon } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { t } from "@utils/i18n";
import Layout from "@styles/Layout";

interface ChapterProgressBarProps {
  total: number;
  playCount?: number;
}

export default function ChapterProgressBar({
  total,
  playCount = 0,
}: ChapterProgressBarProps) {
  const completed = playCount === total;

  const getPlayRatio = () => {
    return `${playCount}/${total}`;
  };

  if (completed) {
    return (
      <HStack alignItems="center" pb={2} px={4}>
        <Text fontSize="sm" color="gray.500" mr={1}>
          {t("Played")}
        </Text>
        <Icon
          as={<MaterialCommunityIcons name="check-circle" />}
          color="primary.400"
          size="xs"
        />
      </HStack>
    );
  }
  return (
    <HStack alignItems="center" pb={2} px={4}>
      <Text
        fontSize="sm"
        _light={{ color: "gray.500" }}
        _dark={{ color: "coolGray.200" }}
        mr={2}
      >
        {`${t("Played")}: ${getPlayRatio()}`}
      </Text>

      <Box
        backgroundColor="gray.200"
        borderRadius={20}
        height={1.5}
        width={Layout.scaleWidth(30)}
      >
        <Box
          backgroundColor="primary.400"
          borderRadius={20}
          height="100%"
          width={`${(playCount / total) * 100}%`}
        />
      </Box>
    </HStack>
  );
}
