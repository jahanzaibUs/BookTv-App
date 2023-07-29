import React from "react";
import { HStack, Text, Box, Icon, Heading } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import PromptModal from "@components/Modal/PromptModal";
import { t } from "@utils/i18n";
import { ExpLog } from "@states/QuestState";

interface MissionPromptProps {
  isVisible: boolean;
  onBackdropPress: () => void;
  onModalHide?: () => void;
  totalExp: number;
  expLog: ExpLog[];
}

export default function MissionPrompt({
  isVisible,
  onBackdropPress,
  onModalHide,
  totalExp,
  expLog,
}: MissionPromptProps) {
  const ExpItem = ({ title, exp }: { title: string; exp: number }) => {
    return (
      <HStack justifyContent="space-between" alignItems="center" mb={4}>
        <HStack>
          <Icon
            as={<MaterialCommunityIcons name="check-circle" />}
            color="primary.400"
            size="sm"
            mr={2}
          />
          <Text>{title}</Text>
        </HStack>
        <Text>+{exp}</Text>
      </HStack>
    );
  };

  const renderMissionSummary = () => {
    if (totalExp) {
      return (
        <Box width="85%">
          <Heading fontSize="2xl" alignSelf="center" mt={-2}>
            {`+${totalExp} ${t("EXP")}`}
          </Heading>

          <Box mt={8}>
            {expLog.map((log) => (
              <ExpItem key={log.id} title={log.source.content} exp={log.exp} />
            ))}
          </Box>
        </Box>
      );
    }
    return (
      <Heading
        fontSize="md"
        _light={{ color: "gray.600" }}
        _dark={{ color: "coolGray.300" }}
        mt={-2}
      >
        {t("NO_EXP")}
      </Heading>
    );
  };

  return (
    <PromptModal
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}
      onModalHide={onModalHide}
      imgSrc={require("@assets/images/target.png")}
      title={t("YTD_MISSION_TITLE")}
      titleStyle={{ fontSize: "lg" }}
    >
      {renderMissionSummary()}
    </PromptModal>
  );
}
