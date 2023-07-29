import React from "react";
import { TouchableOpacity } from "react-native";
import { HStack, Text, Icon } from "native-base";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

interface ListItemProps {
  children: any;
  isFirst?: boolean;
  isLast?: boolean;
  icon?: any;
  renderLeftIcon?: () => JSX.Element;
  renderRightComponent?: () => JSX.Element;
  hideRightIcon?: boolean;
}

const ListItem = ({
  children,
  isFirst = false,
  isLast = false,
  icon,
  renderLeftIcon,
  renderRightComponent,
  hideRightIcon,
  ...props
}: ListItemProps) => {
  return (
    <TouchableOpacity {...props}>
      <HStack
        alignItems="center"
        justifyContent="space-between"
        borderBottomWidth={isLast ? 0 : 0.5}
        borderColor="gray.200"
        borderTopRadius={isFirst ? 12 : 0}
        borderBottomRadius={isLast ? 12 : 0}
        _light={{ bg: "white" }}
        _dark={{ bg: "coolGray.700" }}
        px={5}
        py={3}
      >
        <HStack>
          {icon && <Icon as={<Feather name={icon} />} size="sm" />}
          {renderLeftIcon && renderLeftIcon()}

          <Text fontSize="sm" fontWeight={500} ml={3}>
            {children}
          </Text>
        </HStack>

        {!hideRightIcon && !renderRightComponent && (
          <Icon
            as={<MaterialCommunityIcons name="chevron-right-circle" />}
            size="xs"
            color="primary.400"
          />
        )}
        {renderRightComponent && renderRightComponent()}
      </HStack>
    </TouchableOpacity>
  );
};

export default ListItem;
