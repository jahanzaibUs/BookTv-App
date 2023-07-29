import React from "react";
import { VStack, Button, Heading, Text, Icon } from "native-base";
import { Feather } from "@expo/vector-icons";

import { t } from "@utils/i18n";
import ROUTES from "@navigation/Routes";

interface OrderConfirmationProps {
  navigation: any;
  onDismiss?: () => void;
  itemId: string;
}

export default function OrderConfirmation({
  navigation,
  onDismiss,
  itemId,
}: OrderConfirmationProps) {
  const onViewLesson = () => {
    navigation.navigate(ROUTES.LESSON_TAB, {
      screen: ROUTES.VIDEO_LESSON,
      params: { id: itemId },
    });
  };

  const onViewPurchase = () => {
    navigation.navigate(ROUTES.ACCOUNT_TAB, {
      initial: false,
      screen: ROUTES.PURCHASE_RECORD,
    });
  };

  return (
    <VStack
      flex={1}
      _light={{ bg: "white" }}
      _dark={{ bg: "coolGray.800" }}
      justifyContent="center"
      alignItems="center"
      mt={-20}
    >
      <Icon
        as={<Feather name="x" />}
        onPress={onDismiss}
        position="absolute"
        top={150}
        right={15}
      />

      <Icon as={<Feather name="check" />} size="2xl" color="primary.300" />

      <Heading mt={8} mb={6} lineHeight="40px">
        {t("ORDER_SUCCESS_TITLE")}
      </Heading>
      <Text width="60%" mb={16} textAlign="center">
        {t("ORDER_SUCCESS_CONTENT")}
      </Text>

      <Button
        // @ts-ignore
        variant="primary"
        shadow={0}
        width={40}
        mb={5}
        onPress={() => {
          if (onDismiss) {
            onDismiss();
          }
          onViewLesson();
        }}
      >
        {t("Start Reading")}
      </Button>
      <Button
        // @ts-ignore
        variant="secondary"
        shadow={0}
        width={40}
        onPress={() => {
          if (onDismiss) {
            onDismiss();
          }
          onViewPurchase();
        }}
      >
        {t("Purchase Record")}
      </Button>
    </VStack>
  );
}
