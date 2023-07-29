import React from "react";
import { Center, Text, Icon, ICenterProps } from "native-base";
import { Ionicons } from "@expo/vector-icons";

import { t } from "@utils/i18n";

interface Props extends ICenterProps {
  iconName?: React.ComponentProps<typeof Ionicons>["name"];
  title?: string;
  size?: string | number;
  color?: string;
}

export default function EmptyView({
  iconName,
  title,
  size,
  color,
  ...props
}: Props) {
  return (
    <Center flex={1} {...props}>
      <Icon
        as={<Ionicons name={iconName || "book"} />}
        size={size || "3xl"}
        color={color || "gray.300"}
        mb={5}
      />
      <Text>{t(title || "CONNECT_ERROR")}</Text>
    </Center>
  );
}
