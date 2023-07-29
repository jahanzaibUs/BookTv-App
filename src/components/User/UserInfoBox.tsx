import React from "react";
import { HStack, Heading, Text, Button, Box, Avatar } from "native-base";

import { ProfileState } from "@store/states/AuthState";
import { t } from "@utils/i18n";

interface UserInfoBoxProps {
  profile: ProfileState;
  onEditProfile?: () => void;
  containerProps?: any;
}

export default function UserInfoBox({
  profile,
  onEditProfile,
  containerProps,
}: UserInfoBoxProps) {
  return (
    <HStack {...containerProps}>
      <Avatar
        source={
          profile.avatar
            ? { uri: `${profile.avatar}` }
            : require("@assets/images/avatar-placeholder.jpg")
        }
        size="lg"
        shadow={1}
        bg="white"
        mx={3}
      />

      <Box px={4} width={"75%"}>
        <Heading fontSize="xl" fontWeight={500} noOfLines={1}>
          {profile.username}
        </Heading>
        <Text fontSize="md" mt={1}>{`${t("Member ID")}: ${profile.id}`}</Text>
        <Text fontSize="sm" noOfLines={1}>
          {profile.email}
        </Text>

        {!!onEditProfile && (
          <Button
            size="xs"
            variant="outline"
            colorScheme="gray"
            mt={2}
            onPress={() => onEditProfile()}
          >
            {t("Edit Profile")}
          </Button>
        )}
      </Box>
    </HStack>
  );
}
