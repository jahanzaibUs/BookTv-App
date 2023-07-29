import React from "react";
import Modal from "react-native-modal";
import { Box, Button, Heading, VStack, Text, Image } from "native-base";

import Layout from "@styles/Layout";
import IconButton from "@components/IconButton";

interface AlertModalProps {
  isVisible: boolean;
  onBackdropPress: () => void;
  onModalHide?: () => void;
  title: string;
  message?: string;
  topIcon?: any;
  imgSrc?: any;
  buttons?: AlertButton[];
  children: JSX.Element;
  titleStyle?: any;
  messageStyle?: any;
}

interface AlertButton {
  label: string;
  onPress?: () => void;
}

export default function PromptModal({
  isVisible,
  onBackdropPress,
  onModalHide,
  title,
  message,
  imgSrc,
  topIcon,
  children,
  buttons,
  titleStyle,
  messageStyle,
}: AlertModalProps) {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}
      backdropOpacity={0.4}
      onModalHide={onModalHide}
    >
      <Box
        _light={{ bg: "white" }}
        _dark={{ bg: "coolGray.700" }}
        alignSelf="center"
        alignItems="center"
        justifyContent="center"
        borderRadius={28}
        width={Layout.scaleWidth(90)}
        minHeight={200}
        maxHeight={"100%"}
        py={6}
        px={5}
      >
        <Box position="absolute" right={5} top={5}>
          <IconButton
            name="close"
            family="MaterialCommunityIcons"
            onPress={onBackdropPress}
          />
        </Box>

        {!!imgSrc && (
          <Box mb={3}>
            <Image source={imgSrc} size={60} alt="icon" />
          </Box>
        )}
        {!!topIcon && topIcon}
        <Heading
          fontSize="2xl"
          lineHeight={10}
          mb={2}
          textAlign="center"
          {...titleStyle}
        >
          {title}
        </Heading>
        {!!message && (
          <Text
            bold
            fontSize="md"
            color="gray.500"
            textAlign="center"
            width="80%"
            {...messageStyle}
          >
            {message}
          </Text>
        )}

        {children}

        <VStack mt={5} width="100%">
          {buttons &&
            buttons.map((btn) => (
              <Button
                key={btn.label}
                // @ts-ignore
                variant="primary"
                onPress={btn.onPress}
                mb={3}
              >
                {btn.label}
              </Button>
            ))}
        </VStack>
      </Box>
    </Modal>
  );
}
