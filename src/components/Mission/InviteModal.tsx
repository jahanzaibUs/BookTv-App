import React from "react";
import { HStack, Text, Box } from "native-base";

import IconButton from "@components/IconButton";
import PromptModal from "@components/Modal/PromptModal";
import { t } from "@utils/i18n";
import { onShare } from "@utils/share";
import { useAppSelector } from "@hooks/redux";
import { getProfile } from "@selectors/authSelector";
import { logEvent, EXP } from "@utils/expLogger";
import ReferralCode from "./ReferralCode";
interface InviteModalProps {
  isVisible: boolean;
  onBackdropPress: () => void;
}

export default function InviteModal({
  isVisible,
  onBackdropPress,
}: InviteModalProps) {
  const profile = useAppSelector(getProfile);

  const renderInvitation = () => (
    <Box mt={8} mb={5} maxWidth={200}>
      <Text textAlign="center">{t("INVITE_CONTENT")}</Text>

      <HStack
        justifyContent="space-between"
        alignSelf="center"
        mt={5}
        width="100%"
      >
        <IconButton
          family="MaterialCommunityIcons"
          name="whatsapp"
          color="#42C552"
          size="lg"
          disabled
        />
        <IconButton
          family="MaterialCommunityIcons"
          name="instagram"
          color="pink.600"
          size="lg"
          disabled
        />
        <IconButton
          family="MaterialCommunityIcons"
          name="facebook"
          color="#1977F2"
          size="lg"
          disabled
        />
        <IconButton
          family="MaterialCommunityIcons"
          name="wechat"
          color="#65AB22"
          size="lg"
          disabled
        />
      </HStack>

      <ReferralCode value={profile.code} />
    </Box>
  );

  const onPressShare = () => {
    onShare(
      {
        message: "跟我一起學習成長",
        referralCode: profile.code,
      },
      () => logEvent(EXP.SHARE)
    );
  };

  return (
    <PromptModal
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}
      imgSrc={require("@assets/images/invite.png")}
      title={t("INVITE_TITLE")}
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
