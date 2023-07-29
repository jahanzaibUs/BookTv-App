import React from "react";
import { TouchableOpacity } from "react-native";
import { Box, Heading, Image, Text } from "native-base";
import moment from "moment";

import Layout from "@styles/Layout";
import { getFileUrl } from "@utils/file";

interface NewsCardProps {
  imageSource: { url: string };
  title: string;
  content: string;
  createdAt: string;
  isFirst: boolean;
  onPress?: () => void;
}

const NewsCard = (props: NewsCardProps) => {
  const { imageSource, onPress, title, content, createdAt, isFirst } = props;
  const WIDTH = Layout.scaleWidth(90);
  const HEIGHT = Layout.scaleWidth(70);

  return (
    <TouchableOpacity onPress={onPress}>
      <Box
        borderRadius={12}
        _light={{ bg: "white" }}
        _dark={{ bg: "coolGray.700" }}
        shadow={1}
        width={WIDTH}
        minHeight={HEIGHT}
        mt={isFirst ? 5 : 0}
        mb={5}
      >
        <Image
          borderTopRadius={12}
          width={WIDTH}
          height={WIDTH}
          source={{
            uri: getFileUrl(imageSource?.url),
          }}
          alt={title}
        />

        <Box px={3} py={3}>
          <Heading fontSize="lg" noOfLines={1}>
            {title}
          </Heading>
          <Text
            fontSize="sm"
            _light={{ color: "gray.600" }}
            _dark={{ color: "white" }}
            noOfLines={2}
            lineHeight={5}
          >
            {content}
          </Text>
          <Text
            fontSize="xs"
            _light={{ color: "gray.600" }}
            _dark={{ color: "white" }}
            mt={1}
          >
            {moment(createdAt).fromNow()}
          </Text>
        </Box>
      </Box>
    </TouchableOpacity>
  );
};

export default NewsCard;
