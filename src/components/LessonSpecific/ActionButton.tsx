import React from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { Icon, Text, VStack } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ActionButtonProps {
  label: string;
  icon: any;
  onPress?: () => void;
  selected?: boolean;
  editable: boolean;
  tintColor?: string;
  loading?: boolean;
}

function getIconName(name: any, editable: boolean, selected?: boolean) {
  if (!editable) {
    return name;
  }
  if (selected) {
    return name;
  }
  return `${name}-outline`;
}

function getIconColor(tintColor?: string, selected?: boolean) {
  const defaultColor = "primary.400";

  if (selected) {
    return tintColor || defaultColor;
  }
  return "gray.400";
}

export default function ActionButton({
  label,
  icon,
  onPress,
  selected,
  editable,
  tintColor,
  loading,
}: ActionButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} disabled={loading}>
      <VStack alignItems="center">
        {loading ? (
          <ActivityIndicator size="small" />
        ) : (
          <Icon
            as={
              <MaterialCommunityIcons
                name={getIconName(icon, editable, selected)}
              />
            }
            size="26px"
            color={getIconColor(tintColor, selected)}
          />
        )}
        <Text
          fontSize="sm"
          _light={{ color: "gray.500" }}
          _dark={{ color: "coolGray.200" }}
        >
          {label}
        </Text>
      </VStack>
    </TouchableOpacity>
  );
}
