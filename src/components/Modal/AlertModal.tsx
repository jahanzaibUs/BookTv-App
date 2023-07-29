import React from "react";
import Modal from "react-native-modal";
import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  IButtonProps,
  Text,
} from "native-base";

import Layout from "@styles/Layout";

interface AlertButton {
  label: string;
  onPress?: (value?: string) => void;
}

interface AlertButtonProps extends IButtonProps {
  label: string;
  onPress?: () => void;
}

function AlertButton({ onPress, label, ...props }: AlertButtonProps) {
  return (
    <Button
      variant="ghost"
      py={1}
      px={12}
      _pressed={{
        backgroundColor: "primary.50",
      }}
      onPress={onPress}
      {...props}
    >
      {label}
    </Button>
  );
}

interface AlertModalProps {
  isVisible: boolean;
  onBackdropPress: () => void;
  title: string;
  message?: string;
  buttons?: AlertButton[];
  activeBtnIndex?: number;
  renderExtra?: () => JSX.Element;
}

export default function AlertModal({
  isVisible,
  onBackdropPress,
  title,
  message,
  buttons,
  activeBtnIndex = 0,
  renderExtra,
}: AlertModalProps) {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}
      backdropOpacity={0.4}
    >
      <Box
        _light={{ bg: "white" }}
        _dark={{ bg: "coolGray.700" }}
        alignSelf="center"
        alignItems="center"
        justifyContent="center"
        borderRadius={28}
        width={Layout.scaleWidth(85)}
        minHeight={200}
        padding={10}
      >
        <Heading fontSize="xl" color="primary.400" mb={1}>
          {title}
        </Heading>
        {!!message && <Text fontSize="sm">{message}</Text>}

        {renderExtra && renderExtra()}

        <HStack mt={5} justifyContent="space-between">
          {buttons &&
            buttons.map((button, index) => {
              const isFirst = index === 0;
              const isLast = index === buttons.length - 1;

              return (
                <React.Fragment key={button.label}>
                  {index !== 0 && <Divider orientation="vertical" />}
                  <AlertButton
                    colorScheme={index === activeBtnIndex ? "primary" : "gray"}
                    borderRightRadius={isLast ? 20 : 0}
                    borderLeftRadius={isFirst ? 20 : 0}
                    onPress={button.onPress}
                    label={button.label}
                  />
                </React.Fragment>
              );
            })}
        </HStack>
      </Box>
    </Modal>
  );
}
