import React from "react";
import { TouchableOpacity } from "react-native";
import { Image, View, Icon, Center } from "native-base";

import Layout from "@styles/Layout";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getFileUrl } from "@utils/file";

interface BookPreviewProps {
  imageSource: { url: string };
  title?: string;
  onPress?: () => void;
}

const BookPreview = (props: BookPreviewProps) => {
  const { imageSource, onPress, title } = props;
  const defaultRatio = 5 / 3;

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <View backgroundColor="gray.300">
        <Image
          source={{ uri: getFileUrl(imageSource?.url) }}
          alt={title || "book cover"}
          height={Layout.deviceWidth / defaultRatio}
          width={Layout.deviceWidth}
          resizeMode="contain"
        />

        <Center
          backgroundColor="white"
          size="36px"
          borderRadius="180px"
          position="absolute"
          right={4}
          bottom={4}
          shadow={1}
        >
          <Icon
            as={<MaterialCommunityIcons name="eye-circle" />}
            color="primary.300"
            size="44px"
          />
        </Center>
      </View>
    </TouchableOpacity>
  );
};

export default BookPreview;
