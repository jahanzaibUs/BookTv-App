import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Box, HStack, Image, Text } from "native-base";
import Carousel from "react-native-snap-carousel";

import { NewsItem } from "@store/states/NewsState";
import Layout from "@styles/Layout";
import PaginationDot from "./PaginationDot";

interface HeroCarouselProps {
  entries: any[];
  onPress: (item: NewsItem) => void;
  hidePagination?: boolean;
}

export default function HeroCarousel({
  entries,
  onPress,
  hidePagination,
}: HeroCarouselProps) {
  const [activeIndex, setIndex] = useState(0);
  const defaultRatio = 16 / 8;
  const WIDTH = Layout.scaleWidth(90);
  const showTitle = false;

  const renderItem = React.useCallback(({ item }: { item: any }) => {
    return (
      <TouchableOpacity onPress={() => onPress(item)}>
        <Image
          source={{ uri: item.banner?.url }}
          alt="banner"
          height={WIDTH / defaultRatio}
          width={WIDTH}
          borderRadius={10}
        />

        {(item.showTitle || showTitle) && (
          <Box
            position="absolute"
            backgroundColor="#00000045"
            justifyContent="flex-end"
            bottom={12}
            mx={5}
            p={2}
          >
            <Text bold fontSize="2xl" color="white">
              {item.title}
            </Text>
          </Box>
        )}
      </TouchableOpacity>
    );
  }, []);

  return (
    <HStack justifyContent="center" mt={2}>
      <Carousel
        data={entries}
        renderItem={renderItem}
        sliderWidth={Layout.deviceWidth}
        itemWidth={WIDTH}
        loop
        autoplay
        autoplayInterval={12000}
        onSnapToItem={(index) => setIndex(index)}
        vertical={false}
      />

      {!hidePagination && (
        <PaginationDot noOfDots={entries.length} activeDotIndex={activeIndex} />
      )}
    </HStack>
  );
}
