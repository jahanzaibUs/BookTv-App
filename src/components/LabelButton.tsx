import React from "react";
import { TouchableOpacity } from "react-native";
import { Text, ITextProps } from "native-base";

interface LabelButton extends ITextProps {
  children: string;
  disabled?: boolean;
  onPress?: () => void;
}

export default function LabelButton({
  children,
  disabled,
  onPress,
  ...props
}: LabelButton) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Text fontWeight={500} {...props}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}
