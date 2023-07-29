import React from "react";
import { TouchableOpacity } from "react-native";
import { Heading, Image, HStack, Stack, Text } from "native-base";

import Layout from "@styles/Layout";
import { getFileUrl } from "@utils/file";
import { LessonCollection } from "@store/states/LessonState";

interface BookListItemProps {
  imageSource: { url: string };
  title: string;
  desc: string;
  author?: string;
  price?: number;
  collection?: LessonCollection;
  onPress?: () => void;
  isFirst?: boolean;
  hidePrice?: boolean;
}

const PremiumBadge = () => (
  <Stack bgColor="gray.600" px={2} borderRadius={18} minWidth={"90px"}>
    <Text fontSize="xs" color="white" fontWeight={600} textAlign="center">
      VIP會員免費
    </Text>
  </Stack>
);

const BookListItem = (props: BookListItemProps) => {
  const { imageSource, title, desc, onPress, author, price, hidePrice } = props;

  return (
    <TouchableOpacity onPress={onPress}>
      <HStack
        mb={5}
        mx={5}
        backgroundColor="transparent"
        height={Layout.scaleHeight(15)}
        minHeight={120}
      >
        <Image
          source={{ uri: getFileUrl(imageSource?.url) }}
          alt={title}
          width={`${Layout.scaleWidth(20)}px`}
          height="100%"
          resizeMode={imageSource ? "contain" : "cover"}
        />

        <Stack
          mx={5}
          py={3}
          flex={1}
          flexDirection="column"
          justifyContent="space-between"
        >
          <Stack>
            <Heading size="sm" noOfLines={2}>
              {title}
            </Heading>
            <Text
              fontSize="sm"
              noOfLines={1}
              _light={{ color: "gray.700" }}
              _dark={{ color: "white" }}
            >
              {desc}
            </Text>
            <Text
              fontSize="sm"
              fontWeight="400"
              _light={{ color: "gray.500" }}
              _dark={{ color: "white" }}
            >
              {!!author && `${author}`}
            </Text>
          </Stack>

          <HStack justifyContent="space-between" mt={2}>
            {!hidePrice && <PremiumBadge />}
            {!hidePrice && price && (
              <Heading size="sm" color="primary.600">
                {`$${price}`}
              </Heading>
            )}
          </HStack>
        </Stack>
      </HStack>
    </TouchableOpacity>
  );
};

export default BookListItem;
