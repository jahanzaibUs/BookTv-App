import React from "react";
import { TouchableOpacity } from "react-native";
import { Center, Text, useColorModeValue } from "native-base";

import { t } from "@utils/i18n";
import Layout from "@styles/Layout";

interface FilterButtonProps {
  label: string;
  selected?: boolean;
  isFirst?: boolean;
  onPress?: () => void;
  numOfItems: number;
  fontSize?: any;
}

export default function FilterButton(props: FilterButtonProps) {
  const { label, selected, onPress, isFirst, numOfItems, fontSize } = props;
  const textColor = useColorModeValue("black", "white");

  return (
    <TouchableOpacity onPress={onPress}>
      <Center
        minWidth={`${Layout.deviceWidth / (numOfItems + 1)}px`}
        px={2}
        pb={0.5}
        mr={3}
        ml={isFirst ? 5 : 0}
      >
        <Text
          fontWeight={500}
          color={selected ? textColor : "gray.400"}
          fontSize={fontSize || "md"}
        >
          {t(label)}
        </Text>
        <Center
          width="70%"
          height="5px"
          borderRadius="6px"
          backgroundColor={selected ? "primary.400" : "transparent"}
          mt="1px"
        />
      </Center>
    </TouchableOpacity>
  );
}
