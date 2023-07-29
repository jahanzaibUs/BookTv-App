import React from "react";
import { HStack, Text, Icon, Box } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { t } from "@utils/i18n";
import Layout from "@styles/Layout";

interface ProgressBarProps {
  played: boolean;
  total: number; // ms
  current?: number;
}

export default function ProgressBar({
  played,
  total,
  current = 0,
}: ProgressBarProps) {
  const getRemainingTime = () => {
    const secs = Math.round((total - current) / 1000);
    let mins = secs / 60;
    let hrs = 0;
    if (mins >= 60) {
      hrs = Math.round(mins / 60);
      mins -= hrs * 60;
      return `${hrs}小時${Math.round(mins)}分鐘`;
    }
    return `${Math.round(mins)}分鐘`;
  };

  if (played) {
    return (
      <HStack alignItems="center">
        <Text
          fontSize="sm"
          _light={{ color: "gray.500" }}
          _dark={{ color: "coolGray.200" }}
          mr={1}
        >
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
  if (current) {
    return (
      <HStack alignItems="center">
        <Text
          fontSize="sm"
          _light={{ color: "gray.500" }}
          _dark={{ color: "coolGray.200" }}
          mr={2}
        >
          {`${t("Remaining Time")}: ${getRemainingTime()}`}
        </Text>

        <Box
          backgroundColor="gray.200"
          borderRadius={20}
          height={1}
          width={`${Layout.scaleWidth(20)}px`}
        >
          <Box
            backgroundColor="primary.400"
            borderRadius={20}
            height="100%"
            width={`${(current / total) * 100}%`}
          />
        </Box>
      </HStack>
    );
  }
  return (
    <Text
      fontSize="sm"
      _light={{ color: "gray.500" }}
      _dark={{ color: "coolGray.200" }}
    >
      {getRemainingTime()}
    </Text>
  );
}
