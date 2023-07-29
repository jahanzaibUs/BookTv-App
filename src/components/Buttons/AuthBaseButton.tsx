import React from "react";
import { TouchableOpacity } from "react-native";
import { Icon, Center, Image } from "native-base";
import { FontAwesome } from "@expo/vector-icons";

export interface AuthBaseButtonProps {
  name: any;
  backgroundColor?: string;
  disabled?: boolean;
  onPress?: any;
}

const SIZE = 40;
const BORDER_RADIUS = 20;

function getIcon(name: any) {
  switch (name) {
    case "google":
      return (
        <Image
          source={require("@assets/images/logo_google.png")}
          size={6}
          alt="google"
        />
      );
    default:
      return (
        <Icon
          as={<FontAwesome name={name} />}
          size="sm"
          color="white"
          textAlign="center"
        />
      );
  }
}

export default function AuthBaseButton({
  name,
  backgroundColor = "white",
  disabled,
  onPress,
}: AuthBaseButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Center
        backgroundColor={backgroundColor}
        borderRadius={`${BORDER_RADIUS}px`}
        size={`${SIZE}px`}
      >
        {getIcon(name)}
      </Center>
    </TouchableOpacity>
  );
}
