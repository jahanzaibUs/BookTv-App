import React from "react";
import { TouchableOpacity } from "react-native";
import { Center, Heading, HStack, useColorModeValue } from "native-base";

import { t } from "@utils/i18n";
import Layout from "@styles/Layout";

interface TabBarProps {
  labels: string[];
  selectedIndex: number;
  onChangeTab: (tabIndex: number) => void;
}

interface TabButtonProps {
  label: string;
  selected: boolean;
  width: number;
  onPress: () => void;
}

function TabButton({ onPress, label, selected, width }: TabButtonProps) {
  const textColor = useColorModeValue("black", "white");

  return (
    <TouchableOpacity onPress={onPress}>
      <Center width={width} height={12}>
        <Heading color={selected ? textColor : "gray.400"} fontSize="md">
          {t(label)}
        </Heading>
        <Center
          width="25%"
          height="5px"
          borderRadius="6px"
          backgroundColor={selected ? "primary.400" : "transparent"}
        />
      </Center>
    </TouchableOpacity>
  );
}

const TabBar = (props: TabBarProps) => {
  const { labels, selectedIndex = 0, onChangeTab } = props;
  const btnWidth = Layout.deviceWidth / labels.length;

  const onPressTab = (tabIndex: number) => {
    if (tabIndex === selectedIndex) {
      return;
    }
    onChangeTab(tabIndex);
  };

  return (
    <HStack>
      {labels.map((label, index) => (
        <TabButton
          key={label}
          label={label}
          selected={selectedIndex === index}
          onPress={() => onPressTab(index)}
          width={btnWidth}
        />
      ))}
    </HStack>
  );
};
export default TabBar;
