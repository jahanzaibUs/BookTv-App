import React, { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";
import {
  KeyboardAvoidingView,
  ScrollView,
  VStack,
  Button,
  FormControl,
  Input,
  useToast,
  Heading,
  Text,
} from "native-base";

import { t } from "@utils/i18n";
import { useAppDispatch } from "@hooks/redux";
import { fetchGifts, submitGiftCode } from "@actions/questAction";

interface Props {
  navigation: any;
  route: any;
}

export default function RedeemGift({ navigation, route }: Props) {
  const toast = useToast();
  const dispatch = useAppDispatch();
  const [code, setCode] = useState("");
  const isEmpty = code.trim() === "";

  useEffect(() => {
    if (route.params && route.params.code) {
      setCode(route.params.code);
    }
  }, [route]);

  const onPressSend = async () => {
    Keyboard.dismiss();
    if (isEmpty) {
      return;
    }

    const { success } = await submitGiftCode(code.trim());
    toast.show({
      description: success ? t("Submitted") : t("GIFT_CODE_ERROR"),
      status: success ? "success" : "error",
      isClosable: false,
      duration: 2000,
    });

    if (success) {
      setCode("");
      dispatch(fetchGifts());
      setTimeout(() => {
        navigation.goBack();
      }, 3000);
    }
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Platform.OS === "ios" ? 95 : 50}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      backgroundColor="white"
      flex={1}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        _contentContainerStyle={{ p: 5 }}
      >
        <Heading fontSize="2xl" mb={2}>
          {t("REDEEM_CODE_TITLE")}
        </Heading>
        <Text
          _light={{ color: "white" }}
          _dark={{ color: "coolGray.200" }}
          mb={4}
        >
          {t("REDEEM_CODE_CONTENT")}
        </Text>

        <VStack justifyContent="space-between" mb={5} mt={5}>
          <FormControl mb={4}>
            <Input
              variant="rounded"
              placeholder={t("REDEEM_CODE")}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
              value={code}
              onChangeText={(val) => setCode(val)}
            />
          </FormControl>
        </VStack>

        {/* @ts-ignore */}
        <Button variant="primary" onPress={onPressSend} disabled={isEmpty}>
          {t("Confirm")}
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
