import React from "react";
import { Input, Box, useColorModeValue } from "native-base";

import { t } from "@utils/i18n";
import IconButton from "@components/IconButton";

interface SearchBarProps {
  value: string;
  onChangeText: (val: string) => void;
  onPressFilter?: () => void;
  onSearch: () => void;
}

export default function SearchBar({
  value,
  onChangeText,
  onPressFilter,
  onSearch,
}: SearchBarProps) {
  const bgColor = useColorModeValue("trueGray.100", "coolGray.600");

  return (
    <Box justifyContent="flex-end" alignItems="center">
      <Input
        autoFocus
        variant="filled"
        value={value}
        onChangeText={onChangeText}
        placeholder={t("SEARCH_PLACEHOLDER")}
        placeholderTextColor="trueGray.400"
        returnKeyType="search"
        onSubmitEditing={() => onSearch()}
        bg={bgColor}
        borderRadius={20}
        border={0}
        fontSize={14}
        width="90%"
        minHeight="45px"
        py={2}
        mb={2}
        InputLeftElement={
          <IconButton
            family="Feather"
            name="filter"
            ml={3}
            onPress={onPressFilter}
          />
        }
        InputRightElement={
          <IconButton
            family="Feather"
            name="search"
            mr={3}
            onPress={() => onSearch()}
          />
        }
      />
    </Box>
  );
}
