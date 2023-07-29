import React from "react";
import { HStack, Text, Box, ScrollView, Image, Heading } from "native-base";

import PromptModal from "@components/Modal/PromptModal";
import { t } from "@utils/i18n";
import { LOGIN_EXP } from "@constants/quest";
import Layout from "@styles/Layout";
import { useAppSelector } from "@hooks/redux";
import { getQuestState } from "@selectors/questSelector";

export type QuestInfoType = "level" | "exp" | "plan" | "reward" | "mission";

interface QuestInfoModalProps {
  type: QuestInfoType;
  isVisible: boolean;
  onBackdropPress: () => void;
  infoId: number;
  isLevelup?: boolean;
}

export default function QuestInfoModal({
  type,
  isVisible,
  onBackdropPress,
  infoId,
  isLevelup,
}: QuestInfoModalProps) {
  const { expSources, rewards, missions } = useAppSelector(getQuestState);

  const PlanTable = () => (
    <Image
      source={require("@assets/images/membership1.jpg")}
      alt="plans"
      height={Layout.scaleHeight(50)}
      resizeMode="contain"
    />
  );

  const RewardDetail = () => {
    const rewardLv = rewards.find((l) => l.name === `${infoId}`);

    if (rewardLv) {
      return (
        <Box mt={5} alignItems="center">
          {isLevelup && (
            <Heading fontSize="xl" mb={5}>
              {t("LEVELUP_TITLE")}
            </Heading>
          )}
          <Heading color="primary.500">LV{rewardLv.name}</Heading>
          <Text fontWeight={600}>{`${t("EXP")} ${rewardLv.exp}`}</Text>
          <Text fontWeight={500} mt={3} textAlign="center">
            {rewardLv.reward.content}
          </Text>
          {rewardLv.reward.description.trim() !== "" && (
            <Text
              textAlign="center"
              _light={{ color: "white" }}
              _dark={{ color: "coolGray.200" }}
              mt={2}
            >
              ({rewardLv.reward.description})
            </Text>
          )}
        </Box>
      );
    }
    return null;
  };

  const MissionDetail = () => {
    const mission = missions.find((m) => m.id === infoId);

    if (mission) {
      const sources = mission.exp;
      return (
        <Box mt={5} alignItems="center">
          <Heading fontSize="xl">{mission.title}</Heading>

          <HStack
            borderColor="gray.200"
            borderWidth={2}
            borderBottomWidth={0}
            borderTopRadius={14}
            py={3}
            px={5}
            mt={3}
          >
            <Text width="75%" fontWeight={500}>
              {mission.id !== 1 ? "任務" : "連續日數"}
            </Text>
            <Text width="25%" fontWeight={500}>
              經驗值
            </Text>
          </HStack>

          {mission.id !== 1
            ? sources.map((s, i) => {
                const isLast = i === sources.length - 1;
                return (
                  <HStack
                    key={s.content}
                    alignItems="flex-start"
                    borderColor="gray.200"
                    borderWidth={2}
                    borderBottomWidth={isLast ? 2 : 0}
                    borderBottomRadius={isLast ? 14 : 0}
                    py={3}
                    px={5}
                  >
                    <Text width="75%">{s.content}</Text>
                    <Text textAlign="center" width="25%">
                      +{s.exp}
                    </Text>
                  </HStack>
                );
              })
            : LOGIN_EXP.map((s, i) => {
                const isLast = i === LOGIN_EXP.length - 1;
                return (
                  <HStack
                    key={s.day}
                    alignItems="flex-start"
                    borderColor="gray.200"
                    borderWidth={2}
                    borderBottomWidth={isLast ? 2 : 0}
                    borderBottomRadius={isLast ? 14 : 0}
                    py={3}
                    px={5}
                  >
                    <Text width="80%">
                      {s.day < 5 ? `${s.day}日` : `${s.day}日或以上`}
                    </Text>
                    <Text textAlign="center" width="20%">
                      +{s.exp}
                    </Text>
                  </HStack>
                );
              })}
        </Box>
      );
    }
    return null;
  };

  const LevelInfo = () => (
    <Box mt={5}>
      <HStack
        borderColor="gray.200"
        borderWidth={2}
        borderBottomWidth={0}
        borderTopRadius={14}
        py={3}
        px={5}
      >
        <Text width="30%" fontWeight={500} mr={8}>
          等級
        </Text>
        <Text width="50%" fontWeight={500}>
          所需經驗值
        </Text>
      </HStack>

      {rewards.map((item, i) => {
        const isLast = i === rewards.length - 1;
        return (
          <HStack
            key={item.name}
            alignItems="flex-start"
            borderColor="gray.200"
            borderWidth={2}
            borderBottomWidth={isLast ? 2 : 0}
            borderBottomRadius={isLast ? 14 : 0}
            py={3}
            px={5}
          >
            <Text
              fontSize="lg"
              color="primary.500"
              fontWeight={500}
              width="30%"
              mr={8}
            >
              LV{item.name}
            </Text>
            <Text>{item.exp}</Text>
          </HStack>
        );
      })}
    </Box>
  );

  const ExpInfo = () => (
    <>
      <HStack
        borderColor="gray.200"
        borderWidth={2}
        borderBottomWidth={0}
        borderTopRadius={14}
        py={3}
        px={5}
      >
        <Text width="75%" fontWeight={500}>
          {t("Mission")}
        </Text>
        <Text width="25%" fontWeight={500}>
          {t("EXP")}
        </Text>
      </HStack>

      {expSources.map((item, i) => {
        const isLast = i === expSources.length - 1;
        return (
          <HStack
            key={item.content}
            justifyContent="space-between"
            alignItems="flex-start"
            borderColor="gray.200"
            borderWidth={2}
            borderBottomWidth={isLast ? 2 : 0}
            borderBottomRadius={isLast ? 14 : 0}
            p={3}
          >
            <Text width="75%">{item.content}</Text>
            <Text width="25%" textAlign="right">
              {item.exp}
            </Text>
          </HStack>
        );
      })}
    </>
  );

  const getTitle = () => {
    if (type === "level") {
      return t("Level");
    }
    if (type === "exp") {
      return t("EXP");
    }
    return "";
  };

  const getSubtitle = () => {
    if (type === "level") {
      return t("LEVEL_SUBTITLE");
    }
    if (type === "exp") {
      return t("EXP_SUBTITLE");
    }
    return "";
  };

  return (
    <PromptModal
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}
      title={getTitle()}
      message={getSubtitle()}
    >
      <ScrollView _light={{ bg: "white" }} _dark={{ bg: "coolGray.700" }}>
        {type === "level" && <LevelInfo />}
        {type === "exp" && <ExpInfo />}
        {type === "plan" && <PlanTable />}
        {type === "reward" && <RewardDetail />}
        {type === "mission" && <MissionDetail />}
      </ScrollView>
    </PromptModal>
  );
}
