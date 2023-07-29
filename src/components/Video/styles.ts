import { StyleSheet } from "react-native";
import Layout from "@styles/Layout";

const VIDEO_CONTAINER_HEIGHT = (Layout.deviceWidth * 9) / 16;

export const styles = StyleSheet.create({
  hidden: {
    height: 0,
  },
  videoContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: VIDEO_CONTAINER_HEIGHT,
    width: "100%",
    backgroundColor: "black",
  },
  video: {
    height: VIDEO_CONTAINER_HEIGHT,
    width: Layout.deviceWidth,
  },
  controlOverlay: {
    height: (Layout.deviceWidth * 9) / 16,
    width: Layout.deviceWidth,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 2,
  },
  activeOvelay: {
    backgroundColor: "#00000050",
  },
  inactiveOvelay: {
    backgroundColor: "transparent",
  },
});

export const miniStyles = StyleSheet.create({
  video: {
    width: Layout.scaleWidth(25),
    height: Layout.scaleHeight(6),
    minHeight: 55,
  },
  thumbnail: {
    width: Layout.scaleWidth(25),
    height: Layout.scaleHeight(6),
    resizeMode: "contain",
  },
});

export const infoStyles = StyleSheet.create({
  bottomInfoWrapper: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderBottomColor: "#f4f4f5",
    borderBottomWidth: 4,
  },
  rowWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeLeft: { backgroundColor: "transparent", marginLeft: 5 },
  timeRight: { backgroundColor: "transparent", marginRight: 5 },
  slider: { flex: 1, marginHorizontal: 20 },
});
