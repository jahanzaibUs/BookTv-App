import React from "react";
import { TouchableOpacity } from "react-native";
import { Image } from "native-base";

import Layout from "@styles/Layout";
import { getFileUrl } from "@utils/file";

interface HeroImageProps {
  imageSource: string;
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  height?: number;
  ratio?: number;
  resizeMode?: any;
}

const HeroImage = (props: HeroImageProps) => {
  const { imageSource, onPress, height, ratio, resizeMode } = props;

  const getHeight = () => {
    if (ratio) {
      return Layout.deviceWidth / ratio;
    }
    if (height) {
      return height;
    }
    const defaultRatio = 16 / 9;
    return Layout.deviceWidth / defaultRatio;
  };

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      {imageSource !== "" && (
        <Image
          source={{
            uri: getFileUrl(imageSource),
          }}
          alt="banner"
          height={getHeight()}
          width={Layout.deviceWidth}
          resizeMode={resizeMode || "contain"}
        />
      )}
    </TouchableOpacity>
  );
};

export default HeroImage;
