import React from "react";
import { TouchableOpacity } from "react-native";
import { HStack, Image, Text, Icon, Box, useColorModeValue } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";

import { getFileUrl } from "@utils/file";

interface NotificationItemProps {
  title: string;
  body?: string;
  data?: any;
  type?: string;
  date?: string;
  isRead: boolean;
  onPress?: () => void;
}

const NotificationItem = ({
  title,
  body,
  data,
  date,
  isRead,
  onPress,
}: NotificationItemProps) => {
  const defaultColor = useColorModeValue("black", "white");

  return (
    <TouchableOpacity onPress={onPress}>
      <HStack
        alignItems="center"
        justifyContent="space-between"
        borderBottomWidth={0.5}
        borderColor="gray.200"
        _light={{ bg: "white" }}
        _dark={{ bg: "coolGray.900" }}
        px={5}
        py={4}
      >
        <HStack>
          {!!data?.image && (
            <Image
              source={{ uri: getFileUrl(data.image) }}
              alt={"thumbnail"}
              size="sm"
              resizeMode="cover"
              mr={4}
            />
          )}
          <Box>
            <Text
              fontWeight={500}
              maxWidth="98%"
              noOfLines={2}
              color={isRead ? "gray.400" : defaultColor}
            >
              {title}
            </Text>
            {!!body && (
              <Text
                fontSize="sm"
                _light={{ color: "gray.500" }}
                _dark={{ color: "gray.200" }}
                noOfLines={1}
              >
                {body}
              </Text>
            )}

            <Text fontSize="xs" color="gray.400">
              {moment(date).fromNow()}
            </Text>
          </Box>
        </HStack>

        <Icon
          as={<MaterialCommunityIcons name="chevron-right-circle" />}
          size="xs"
          color="primary.400"
        />
      </HStack>
    </TouchableOpacity>
  );
};

export default NotificationItem;
