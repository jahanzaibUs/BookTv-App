import React from "react";
import { TouchableOpacity } from "react-native";
import { Icon, Box } from "native-base";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SpaceProps } from "styled-system";

type IconName = "Feather" | "Ionicons" | "MaterialCommunityIcons";

interface StyledIconProps {
  name: any;
  family?: IconName;
}

interface IconButtonProps extends SpaceProps {
  name: React.ComponentProps<
    typeof Feather | typeof Ionicons | typeof MaterialCommunityIcons
  >["name"];
  family?: IconName;
  size?: string | number;
  color?: string;
  onPress?: () => void;
  disabled?: boolean;
  badge?: number;
}

function getIcon({ family, name }: StyledIconProps) {
  switch (family) {
    case "Feather":
      return <Feather name={name} />;
    case "Ionicons":
      return <Ionicons name={name} />;
    case "MaterialCommunityIcons":
      return <MaterialCommunityIcons name={name} />;
    default:
      return <Feather name={name} />;
  }
}

export default function IconButton({
  name,
  family = "Feather",
  size = "sm",
  color,
  onPress,
  disabled,
  badge = 0,
  ml,
  mr,
  ...props
}: IconButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Box position="relative" ml={ml} mr={mr}>
        <Icon
          as={getIcon({ family, name })}
          size={size}
          color={color}
          {...props}
        />
        {badge > 0 && (
          <Box
            position="absolute"
            top={"-3px"}
            right={"-3px"}
            bg="rose.500"
            width={"10px"}
            height={"10px"}
            borderRadius={"5px"}
          />
        )}
      </Box>
    </TouchableOpacity>
  );
}
