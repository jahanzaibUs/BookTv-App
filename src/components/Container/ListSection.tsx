import React from "react";
import { HStack, Heading, IHeadingProps, Icon, View } from "native-base";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

import { t } from "@utils/i18n";

interface SectionProps extends IHeadingProps {
  title: string;
  data: any[];
  renderItem: any;
  onShowMore?: () => void;
  limit?: number;
}

export default function Section({
  title,
  size = "lg",
  data,
  renderItem,
  onShowMore,
  limit = 3,
}: SectionProps) {
  return (
    <View mb={10}>
      {data.length !== 0 && (
        <HStack mb={5} justifyContent="space-between" alignItems="center">
          <Heading size={size}>{title}</Heading>
          {!!onShowMore && (
            <TouchableOpacity onPress={onShowMore}>
              <HStack alignItems="center">
                <Heading fontSize="sm" color="primary.300">
                  {t("More")}
                </Heading>
                <Icon
                  as={<Feather name="chevron-right" />}
                  size="xs"
                  color="primary.300"
                />
              </HStack>
            </TouchableOpacity>
          )}
        </HStack>
      )}

      {data.slice(0, limit).map((item, index) => {
        return renderItem({ item, index });
      })}
    </View>
  );
}
