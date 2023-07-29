import React from "react";
import Modal from "react-native-modal";
import { View, Spinner } from "native-base";

interface SpinnerProps {
  animating: boolean;
}

export default function SpinnerModal({ animating }: SpinnerProps) {
  return (
    <Modal
      isVisible={animating}
      backdropOpacity={0.1}
      animationIn="fadeIn"
      animationOut="fadeOut"
    >
      <View
        justifyContent="center"
        alignItems="center"
        alignSelf="center"
        _light={{ bg: "gray.100" }}
        _dark={{ bg: "gray.200" }}
        borderRadius={12}
        width={20}
        height={20}
      >
        <Spinner size="lg" />
      </View>
    </Modal>
  );
}
