import React from "react";
import { View, StyleSheet } from "react-native";
import { Pagination } from "react-native-snap-carousel";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
  },
  dot: {
    backgroundColor: "primary.600",
  },
});

interface PaginationDotProps {
  noOfDots: number;
  activeDotIndex: number;
}

const PaginationDot = (props: PaginationDotProps) => {
  const { noOfDots, activeDotIndex } = props;

  return (
    <View style={styles.container}>
      <Pagination
        dotsLength={noOfDots}
        activeDotIndex={activeDotIndex}
        dotStyle={styles.dot}
        inactiveDotScale={0.6}
      />
    </View>
  );
};

export default PaginationDot;
