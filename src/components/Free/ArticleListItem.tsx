import React from "react";
import { TouchableOpacity } from "react-native";
import { Heading, Image, HStack, Stack, Text } from "native-base";

import Layout from "@styles/Layout";
import { getFileUrl } from "@utils/file";

interface ArticleListItemProps {
  imageSource: { url: string };
  title: string;
  desc: string;
  onPress?: () => void;
  isFirst?: boolean;
}

const SIZE = Layout.scaleWidth(30);

const ArticleListItem = (props: ArticleListItemProps) => {
  const { imageSource, title, desc, onPress } = props;

  return (
    <TouchableOpacity onPress={onPress}>
      <HStack
        mb={5}
        _light={{ bg: "white" }}
        _dark={{ bg: "coolGray.900" }}
        justifyContent="space-between"
      >
        <HStack>
          <Image
            source={{ uri: getFileUrl(imageSource?.url) }}
            alt={title}
            width={SIZE}
            height={SIZE}
            resizeMode="cover"
          />

          <Stack mx={5} width="60%">
            <Heading size="sm" noOfLines={1}>
              {title}
            </Heading>
            <Text
              fontSize="sm"
              noOfLines={2}
              _light={{ color: "gray.500" }}
              _dark={{ color: "coolGray.200" }}
            >
              {desc.slice(0, 25)}...
            </Text>
          </Stack>
        </HStack>
      </HStack>
    </TouchableOpacity>
  );
};

export default ArticleListItem;
