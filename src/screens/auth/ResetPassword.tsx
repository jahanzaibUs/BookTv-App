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
} from "native-base";

import IconButton from "@components/IconButton";
import { resetPassword } from "@data-fetch/auth";
import { t } from "@utils/i18n";
import ROUTES from "@navigation/Routes";

interface ResetPasswordProps {
  navigation: any;
  route: any;
}

export default function ResetPassword({
  navigation,
  route,
}: ResetPasswordProps) {
  const toast = useToast();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password2Visible, setPassword2Visible] = useState(false);
  const [errors, setErrors] = useState({ password: false, password2: false });

  useEffect(() => {
    if (!route.params?.code) {
      toast.show({
        description: "沒有確認碼",
        status: "error",
      });
    }
  }, [route.params]);

  const validate = () => {
    let nextErrs = {
      password: password.trim().length < 8,
      password2: password !== password2,
    };
    setErrors(nextErrs);
    return !Object.values(nextErrs).includes(true);
  };

  const togglePassword = () => setPasswordVisible(!passwordVisible);

  const togglePassword2 = () => setPassword2Visible(!password2Visible);

  const onPressSend = async () => {
    Keyboard.dismiss();
    if (!validate()) {
      return;
    }

    const { success, message } = await resetPassword({
      code: route.params.code,
      password,
    });

    toast.show({
      description: success ? t("Updated") : message,
      status: success ? "success" : "error",
      isClosable: false,
    });
    setPassword("");
    setPassword2("");
    setTimeout(() => {
      navigation.navigate(ROUTES.LOGIN);
    }, 1500);
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
        <Heading fontSize="xl" mb={4}>
          {t("Reset password")}
        </Heading>

        <VStack justifyContent="space-between" mb={5} mt={5}>
          <FormControl mb={4} isInvalid={errors.password}>
            <FormControl.Label>{t("Password")}</FormControl.Label>
            <Input
              value={password}
              onChangeText={(val) => setPassword(val)}
              variant="rounded"
              secureTextEntry={!passwordVisible}
              InputRightElement={
                <IconButton
                  family="MaterialCommunityIcons"
                  name={passwordVisible ? "eye" : "eye-off"}
                  onPress={togglePassword}
                  mr={4}
                />
              }
            />
            <FormControl.ErrorMessage>
              {t("shortPassword")}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={errors.password2}>
            <FormControl.Label>{t("Confirm Password")}</FormControl.Label>
            <Input
              value={password2}
              onChangeText={(val) => setPassword2(val)}
              variant="rounded"
              secureTextEntry={!password2Visible}
              InputRightElement={
                <IconButton
                  family="MaterialCommunityIcons"
                  name={passwordVisible ? "eye" : "eye-off"}
                  onPress={togglePassword2}
                  mr={4}
                />
              }
            />
            <FormControl.ErrorMessage>
              {t("diffPassword")}
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
