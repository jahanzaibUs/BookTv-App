import React from "react";
import { TouchableOpacity } from "react-native";
import {
  HStack,
  Heading,
  Text,
  View,
  Image,
  Icon,
  Center,
  useColorModeValue,
} from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { t } from "@utils/i18n";
import { MediaTrialOption } from "@states/LessonState";
import ProgressBar from "./ProgressBar";

interface ChapterRowProps {
  order: number;
  title: string;
  thumbnail: any;
  purchased: boolean;
  trial: null | MediaTrialOption;
  playing?: boolean;
  isLast: boolean;
  duration?: number;
  timestamp?: number;
  onPress?: () => void;
}

export default function ChapterRow(props: ChapterRowProps) {
  const {
    order,
    title,
    thumbnail,
    playing,
    duration = 0,
    timestamp = 0,
    purchased,
    trial,
    isLast,
    onPress,
  } = props;
  const played = timestamp > 0;
  const unlocked = trial === "full" || trial?.includes("percent");

  const activeColor = useColorModeValue("gray.100", "coolGray.700");
  const inactiveColor = useColorModeValue("white", "coolGray.900");

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <HStack
        backgroundColor={playing ? activeColor : inactiveColor}
        borderBottomWidth={isLast ? 0 : 1}
        borderBottomColor="gray.300"
        py={3}
        px={4}
      >
        {thumbnail ? (
          <Image
            width={100}
            height={60}
            resizeMode="cover"
            borderRadius={6}
            source={
              typeof thumbnail === "string" ? { uri: thumbnail } : thumbnail
            }
            alt={`chapter ${order} thumbnail`}
          />
        ) : (
          <Icon
            as={<MaterialCommunityIcons name="video-outline" />}
            color="primary.500"
          />
        )}

        <View px={3}>
          <Heading fontSize="md">{t("LessonOrder", { order })}</Heading>
          {!!title && (
            <Text
              _light={{ color: "gray.600" }}
              _dark={{ color: "coolGray.200" }}
              noOfLines={1}
            >
              {title}
            </Text>
          )}

          {(unlocked || purchased) && (
            <ProgressBar played={played} total={duration} current={timestamp} />
          )}
        </View>

        {unlocked && !purchased && (
          <Center
            backgroundColor="orange.500"
            borderRadius={16}
            height={"28px"}
            px={2}
            position="absolute"
            top={2}
            right={5}
          >
            <Text fontSize="xs">{t("Free Trial")}</Text>
          </Center>
        )}
        {!unlocked && !purchased && (
          <Icon
            as={<MaterialCommunityIcons name="lock" />}
            size="sm"
            color="gray.400"
            position="absolute"
            top={4}
            right={5}
          />
        )}
      </HStack>
    </TouchableOpacity>
  );
}
