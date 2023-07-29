import React, { useState } from "react";
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
} from "native-base";

import { t } from "@utils/i18n";
import { emailRegex } from "@utils/regex";
import { forgotPassword } from "@data-fetch/auth";

interface ForgetPasswordProps {
  navigation: any;
}

export default function ForgetPassword({ navigation }: ForgetPasswordProps) {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);

  const validate = () => {
    if (emailRegex.test(email)) {
      setError(false);
      return true;
    }
    setError(true);
    return false;
  };

  const onPressSend = async () => {
    Keyboard.dismiss();
    if (!validate()) {
      return;
    }

    const { success } = await forgotPassword(email);
    toast.show({
      description: success ? t("SENT_ALERT") : t("SEND_ERROR"),
      status: success ? "success" : "error",
      isClosable: false,
    });

    if (success) {
      setEmail("");
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
        <Heading fontSize="lg" mb={4}>
          {t("FORGET_EMAIL_TITLE")}
        </Heading>

        <VStack justifyContent="space-between" mb={5} mt={5}>
          <FormControl mb={4} isInvalid={error}>
            <FormControl.Label>{t("Email")}</FormControl.Label>
            <Input
              variant="rounded"
              placeholder="someone@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
              value={email}
              onChangeText={(val) => setEmail(val)}
            />
            <FormControl.ErrorMessage>
              {t("invalidEmail")}
            </FormControl.ErrorMessage>
          </FormControl>
        </VStack>

        {/* @ts-ignore */}
        <Button variant="primary" onPress={onPressSend}>
          {t("Submit")}
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
