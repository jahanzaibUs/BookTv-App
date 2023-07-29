import { Dimensions, PixelRatio } from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const space = 15;

// Responsive screen
const scaleWidth = (percentage: number) => {
  const widthByPercentage = PixelRatio.roundToNearestPixel(
    (width * percentage) / 100
  );
  return widthByPercentage;
};

const scaleHeight = (percentage: number) => {
  const heightByPercentage = PixelRatio.roundToNearestPixel(
    (height * percentage) / 100
  );
  return heightByPercentage;
};

export default {
  isSmallDevice: width < 375,
  deviceWidth: width,
  deviceHeight: height,
  scaleWidth,
  scaleHeight,
  space,
};
