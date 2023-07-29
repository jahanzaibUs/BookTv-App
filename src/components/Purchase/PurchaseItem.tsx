import React from "react";
import { TouchableOpacity } from "react-native";
import { HStack, Image, Text, Box } from "native-base";
import moment from "moment";

import { t } from "@utils/i18n";

interface PurchaseItemProps {
  title: string;
  scope?: string;
  price: number;
  imageSource?: string;
  purchaseAt?: string;
  onPress?: () => void;
}

const PurchaseItem = ({
  title,
  scope,
  price,
  imageSource,
  purchaseAt,
  onPress,
}: PurchaseItemProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <HStack
        alignItems="center"
        justifyContent="space-between"
        borderBottomWidth={0.5}
        borderColor="gray.200"
        pl={5}
        pr={8}
        py={3}
      >
        <HStack flex={1}>
          {imageSource !== "" && (
            <Image
              source={{
                uri: imageSource,
              }}
              alt={"book cover"}
              size="md"
              resizeMode="contain"
            />
          )}
          <Box width="70%">
            <Text fontWeight={500} noOfLines={2}>
              {title}
            </Text>
            <Text fontSize="sm">{t("All Chapters")}</Text>

            <Text fontSize="sm" color="gray.500" position="absolute" bottom={0}>
              {`${t("Purcahsed at")} ${moment(purchaseAt).format("ll")}`}
            </Text>
          </Box>
        </HStack>

        {!!price && (
          <Text fontWeight={500} color="primary.600">
            ${price}
          </Text>
        )}
      </HStack>
    </TouchableOpacity>
  );
};

export default PurchaseItem;
