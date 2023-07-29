import React from "react";
import { TouchableOpacity } from "react-native";
import { HStack, Image, Text, Heading, Icon, Box } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";

import { t } from "@utils/i18n";
import { getFileUrl } from "@utils/file";

interface SearchListItemProps {
  title?: string;
  imageSource: { url: string };
  createdAt?: string;
  onPress?: () => void;
}

const SearchListItem = ({
  title,
  imageSource,
  onPress,
}: SearchListItemProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <HStack
        alignItems="center"
        justifyContent="space-between"
        borderBottomWidth={0.5}
        borderColor="gray.200"
        backgroundColor="white"
        px={5}
        py={5}
      >
        <HStack>
          <Image
            source={{ uri: getFileUrl(imageSource?.url) }}
            alt={title || "cover"}
            size="lg"
            resizeMode={imageSource ? "contain" : "cover"}
            mr={2}
          />
          <Box width="60%">
            <Text fontSize="xs" mb={-1}>
              {t("Just added")}
            </Text>
            <Heading size="sm" noOfLines={2}>
              {title}
            </Heading>

            <Text fontSize="xs" color="gray.400" position="absolute" bottom={0}>
              {moment().subtract(2, "day").format("D/M/YYYY")}
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

export default SearchListItem;
