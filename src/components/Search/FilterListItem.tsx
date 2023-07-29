import React from "react";
import { TouchableOpacity } from "react-native";
import { HStack, Text, Icon, Checkbox } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type FilterValue = string | string[] | number[] | boolean;

interface FilterListItemProps {
  label: string;
  value: FilterValue;
  onPress?: () => void;
  renderItem?: () => JSX.Element;
  hideMore?: boolean;
}

const FilterListItem = ({
  label,
  value,
  onPress,
  renderItem,
  hideMore = false,
}: FilterListItemProps) => {
  const formatValue = (val: FilterValue) => {
    if (typeof val === "string") {
      return val;
    }
    if (typeof val === "object") {
      if (typeof val[0] === "string") {
        return val.join(", ");
      }
    }
  };

  return (
    <>
      <TouchableOpacity onPress={onPress} disabled={!onPress}>
        <HStack
          alignItems="center"
          justifyContent="space-between"
          _light={{ bg: "white" }}
          _dark={{ bg: "coolGray.800" }}
          py={2.5}
        >
          <Text fontSize="sm" fontWeight={500}>
            {label}
          </Text>

          <HStack alignItems="center">
            {typeof value === "boolean" ? (
              <Checkbox
                value={label}
                isChecked={value}
                accessibilityLabel="checkbox"
                onChange={() => onPress && onPress()}
              />
            ) : (
              <>
                <Text fontSize="sm" color="gray.400" mr={3}>
                  {formatValue(value)}
                </Text>
                {!hideMore && (
                  <Icon
                    as={<MaterialCommunityIcons name="chevron-right-circle" />}
                    size="xs"
                    color="primary.400"
                  />
                )}
              </>
            )}
          </HStack>
        </HStack>
      </TouchableOpacity>

      {renderItem && renderItem()}
    </>
  );
};

export default FilterListItem;
