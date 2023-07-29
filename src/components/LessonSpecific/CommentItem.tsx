import React from "react";
import { TouchableOpacity } from "react-native";
import { Text, View, HStack, Avatar, Icon } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";

import { t } from "@utils/i18n";

interface CommentItemProps {
  username: string;
  avatar: any;
  content: string;
  status: string | null;
  createAt?: string;
  deleteAt?: string | null;
  onReply?: () => void;
  renderReplies?: any;
  level: number;
  onReport?: () => void;
  authenticated?: boolean;
}

export default function CommentItem(props: CommentItemProps) {
  const {
    username,
    avatar,
    content,
    status,
    onReply,
    onReport,
    createAt,
    deleteAt,
    renderReplies,
    level = 0,
    authenticated = false,
  } = props;
  const indent = level * 3;
  const isParent = level === 0;
  const ySpacing = isParent ? 2 : 3;
  const xSpacing = isParent ? 4 : 2;
  const shouldHide = !!deleteAt || status === "rejected";
  const disabled = shouldHide || !authenticated;

  return (
    <View
      borderLeftWidth={isParent ? 0 : 2}
      _light={{ borderBottomColor: "gray.100", borderLeftColor: "gray.100" }}
      _dark={{
        borderBottomColor: "coolGray.800",
        borderLeftColor: "coolGray.700",
      }}
      borderBottomWidth={isParent ? 8 : 0}
      ml={indent}
      pl={xSpacing}
      pt={ySpacing}
      pr={level === 0 ? 4 : level - 1}
    >
      <HStack alignItems="center" justifyContent="space-between">
        <HStack alignItems="center">
          <Avatar
            source={
              avatar
                ? { uri: avatar.url }
                : require("@assets/images/avatar-placeholder.jpg")
            }
            bg="white"
            size="40px"
            mr={2}
            mb={2}
          />
          <Text fontSize="md" fontWeight={500}>
            {username}
            <Text color="gray.500" fontSize="sm">
              {` ・ ${moment(createAt).fromNow()}`}
            </Text>
          </Text>
        </HStack>

        {!disabled && (
          <TouchableOpacity onPress={onReport}>
            <Icon
              as={<MaterialCommunityIcons name="dots-horizontal" />}
              size="sm"
            />
          </TouchableOpacity>
        )}
      </HStack>

      <Text mb={2} color={shouldHide ? "gray.500" : "black"}>
        {shouldHide ? t("Deleted") : content}
      </Text>

      {!disabled && (
        <TouchableOpacity onPress={onReply} style={{ width: 100 }}>
          <HStack alignItems="center" mb={3}>
            <Icon
              as={<MaterialCommunityIcons name="reply-outline" />}
              color="primary.500"
              size="sm"
            />
            <Text color="primary.500" fontSize="sm">
              {t("Reply")}
            </Text>
          </HStack>
        </TouchableOpacity>
      )}

      {renderReplies && renderReplies()}
    </View>
  );
}
