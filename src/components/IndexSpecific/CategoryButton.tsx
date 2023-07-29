import React from "react";
import { TouchableOpacity } from "react-native";
import { Icon, Text, VStack, Center } from "native-base";
import { Feather } from "@expo/vector-icons";

import Layout from "@styles/Layout";

interface CategoryButtonProps {
  label: string;
  icon: any;
  onPress?: () => void;
}

const SIZE = 50;

export default function CategoryButton({
  label,
  icon,
  onPress,
}: CategoryButtonProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <VStack alignItems="center" width={Layout.deviceWidth / 6} mb={4}>
        <Center
          borderRadius={SIZE / 2}
          width={SIZE}
          height={SIZE}
          mb={2}
          _light={{ bg: "primary.10" }}
          _dark={{ bg: "coolGray.600" }}
          style={{
            elevation: 1,
            shadowColor: "primary.600", // Android 28 up
            // iOS only
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          }}
        >
          <Icon as={<Feather name={icon} />} size="sm" color="primary.500" />
        </Center>

        <Text fontSize="sm">{label}</Text>
      </VStack>
    </TouchableOpacity>
  );
}
