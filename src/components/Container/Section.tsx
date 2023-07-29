import React from "react";
import {
  HStack,
  Heading,
  FlatList,
  IHeadingProps,
  Icon,
  View,
} from "native-base";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

import { t } from "@utils/i18n";

interface SectionProps extends IHeadingProps {
  title: string;
  data: any[];
  renderItem: any;
  ListEmptyComponent?: () => React.ReactElement;
  onShowMore?: () => void;
  horizontal?: boolean;
  useFlatList?: boolean;
}

export default function Section({
  title,
  size = "lg",
  data,
  renderItem,
  ListEmptyComponent,
  onShowMore,
  horizontal = true,
  useFlatList = true,
  ...props
}: SectionProps) {
  return (
    <>
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

      {!useFlatList ? (
        <View mb={data.length !== 0 ? 8 : 0}>
          {data.length === 0 && ListEmptyComponent && ListEmptyComponent()}
          {data.map((item, index) => renderItem({ item, index }))}
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          horizontal={horizontal}
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          ListEmptyComponent={ListEmptyComponent}
          {...props}
          mb={data.length !== 0 ? "40px" : 0}
        />
      )}
    </>
  );
}
