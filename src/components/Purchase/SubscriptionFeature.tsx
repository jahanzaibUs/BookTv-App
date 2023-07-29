import React from "react";
import { Button, Heading, Box, Text, HStack, Icon } from "native-base";
import { Feather } from "@expo/vector-icons";

import { t } from "@utils/i18n";
import Layout from "@styles/Layout";

interface Props {
  data: any;
  isCurrent?: boolean;
  onPress: () => void;
  disabled?: boolean;
  disabledPurchase?: boolean;
  loading?: boolean;
}

export default function SubscriptionFeature({
  data,
  isCurrent,
  onPress,
  disabled,
  disabledPurchase,
  loading,
}: Props) {
  const onSubscribe = () => {
    onPress();
  };

  return (
    <Box
      width={Layout.scaleWidth(90)}
      borderRadius={12}
      borderColor="primary.300"
      shadow={3}
      _light={{ bg: "white" }}
      _dark={{ bg: "coolGray.700" }}
      alignSelf="center"
      px={6}
      py={5}
      mb={5}
    >
      {isCurrent && (
        <Text fontSize="sm" color="gray.400">
          {t("Your Membership")}
        </Text>
      )}
      <HStack justifyContent="space-between" mb={4}>
        <Heading fontSize="xl">{t(data.name)}</Heading>
        <Box justifyContent="flex-start" alignItems="flex-end">
          <Text fontSize="xl" fontWeight="600">
            HK{data.price}
          </Text>
          {data.id !== "T1" && (
            <Text
              fontSize="sm"
              _light={{ color: "white" }}
              _dark={{ color: "coolGray.200" }}
            >
              {t("RENEWAL_INCLUDED", { price: data.renewal_price })}
            </Text>
          )}
        </Box>
      </HStack>

      {data.description.split("\n").map((text: any) => (
        <HStack key={text} alignItems="center" mb={3}>
          <Icon
            as={<Feather name="check-circle" />}
            size="sm"
            color="primary.300"
            mr={2}
          />
          <Text lineHeight="6" mr={3}>
            {text}
          </Text>
        </HStack>
      ))}

      {/* {!isCurrent && !disabledPurchase && (
        <Button
          // @ts-ignore
          variant="primary"
          onPress={() => onSubscribe()}
          mt={4}
          disabled={disabled}
          isLoading={loading}
        >
          {data.tier === "T1" ? t("Subscribe") : t("Upgrade")}
        </Button>
      )} */}
    </Box>
  );
}
