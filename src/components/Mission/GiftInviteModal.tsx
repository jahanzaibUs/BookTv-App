import React from "react";
import { Text, Box, Icon } from "native-base";

import PromptModal from "@components/Modal/PromptModal";
import { t } from "@utils/i18n";
import { onShare } from "@utils/share";
import ReferralCode from "./ReferralCode";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface InviteModalProps {
  isVisible: boolean;
  onBackdropPress: () => void;
  code: string;
}

export default function GiftInviteModal({
  isVisible,
  onBackdropPress,
  code,
}: InviteModalProps) {
  const renderInvitation = () => (
    <Box mt={5} mb={5}>
      <Box maxWidth={220} mb={5} alignSelf="center">
        <Text textAlign="center">{t("GIFT_INVITE_CONTENT")}</Text>
        <ReferralCode value={code} label="REDEEM_CODE" />
      </Box>

      <Text fontSize="sm">* {t("GIFT_TERMS_1")}</Text>
      <Text fontSize="sm">* {t("GIFT_TERMS_2")}</Text>
    </Box>
  );

  const onPressShare = () => {
    onShare({ message: "免費1個月會籍", giftCode: code });
  };

  return (
    <PromptModal
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}
      topIcon={
        <Icon
          as={<MaterialCommunityIcons name="gift-outline" />}
          color="lightBlue.700"
          size="2xl"
          mb={2}
        />
      }
      title={t("GIFT_INVITE_TITLE")}
      buttons={[
        {
          label: t("Share Now"),
          onPress: () => onPressShare(),
        },
      ]}
    >
      {renderInvitation()}
    </PromptModal>
  );
}
