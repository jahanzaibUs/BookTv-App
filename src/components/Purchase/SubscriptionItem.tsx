import React from "react";
import { TouchableOpacity } from "react-native";
import { VStack, Text, Heading, HStack, Icon } from "native-base";
import { Feather } from "@expo/vector-icons";
import moment from "moment";

import { t } from "@utils/i18n";

interface SubscriptionItemProps {
  title: string;
  startDate?: string;
  upgradeDate?: string;
  onPress?: () => void;
}

const SubscriptionItem = ({
  title,
  startDate,
  upgradeDate,
  onPress,
}: SubscriptionItemProps) => {
  const formatDate = (label: string, date: moment.Moment) => {
    return `${t(label)}: ${date.format("ll")}`;
  };

  return (
    <VStack borderBottomWidth={0.5} borderColor="gray.200" px={8} py={3}>
      <HStack justifyContent="space-between" alignItems="center">
        <Heading fontSize="lg">{t(title)}</Heading>

        <TouchableOpacity onPress={onPress}>
          <HStack alignItems="center" mt={2}>
            <Text
              fontSize="sm"
              color="primary.500"
              bold
              backgroundColor="green.100"
            >
              {t("More")}
            </Text>
            <Icon
              as={<Feather name="chevron-right" />}
              size="xs"
              color="primary.400"
            />
          </HStack>
        </TouchableOpacity>
      </HStack>

      {!upgradeDate && (
        <Text fontSize="sm">{formatDate("Start date", moment(startDate))}</Text>
      )}
      {!!upgradeDate && (
        <Text fontSize="sm">
          {formatDate("Upgrade date", moment(upgradeDate))}
        </Text>
      )}
      <Text fontSize="sm" color="primary.600">
        {formatDate("Renew date", moment(startDate).add(1, "year"))}
      </Text>
    </VStack>
  );
};

export default SubscriptionItem;
