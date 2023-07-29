import React, { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";
import {
  KeyboardAvoidingView,
  ScrollView,
  Box,
  VStack,
  Button,
  FormControl,
  Input,
  useToast,
  HStack,
} from "native-base";

import { t } from "@utils/i18n";
import ROUTES from "@navigation/Routes";
import AppleButton from "@components/Buttons/AppleButton";
import FacebookButton from "@components/Buttons/FacebookButton";
import GoogleButton from "@components/Buttons/GoogleButton";
import LabelButton from "@components/LabelButton";
import IconButton from "@components/IconButton";
import { login, connect } from "@actions/authAction";
import { useAppDispatch } from "@hooks/redux";
import { emailRegex } from "@utils/regex";

interface Props {
  navigation: any;
}

export default function Login({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, showPassword] = useState(false);
  const [errors, setErrors] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false,
  });
  const dispatch = useAppDispatch();
  const toast = useToast();

  useEffect(() => {
    if (Object.values(errors).includes(true)) {
      validate();
    }
  }, [email, password]);

  const validate = () => {
    let nextErrs = {
      email: !emailRegex.test(email),
      password: password.length < 8,
    };

    setErrors(nextErrs);
    return !Object.values(nextErrs).includes(true);
  };

  const togglePassword = () => showPassword(!show);

  const goToHome = () => {
    navigation.reset({ index: 0, routes: [{ name: ROUTES.ROOT }] });
  };

  const handleSocialLogin = async (data: {
    provider: string;
    token: string;
  }) => {
    if (data.token) {
      const result = await dispatch(
        connect({ token: data.token, provider: data.provider })
      );

      if (result.authenticated) {
        goToHome();
      } else {
        toast.show({
          description: result.error,
          status: "error",
          isClosable: true,
        });
      }
    }
  };

  const handleLogin = async () => {
    Keyboard.dismiss();
    if (!validate()) {
      return;
    }
    const result = await dispatch(login({ email, password }));

    if (result.authenticated) {
      goToHome();
    } else {
      toast.show({
        description: result.error,
        status: "error",
        isClosable: true,
      });
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
        <VStack justifyContent="space-between" mb={5}>
          <VStack>
            <FormControl mb={4} isInvalid={errors.email}>
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

            <FormControl mb={4} isInvalid={errors.password}>
              <FormControl.Label>{t("Password")}</FormControl.Label>
              <Input
                variant="rounded"
                secureTextEntry={!show}
                value={password}
                onChangeText={(val) => setPassword(val)}
                InputRightElement={
                  <IconButton
                    family="MaterialCommunityIcons"
                    name={show ? "eye" : "eye-off"}
                    onPress={togglePassword}
                    mr={4}
                  />
                }
              />
              <FormControl.ErrorMessage>
                {t("shortPassword")}
              </FormControl.ErrorMessage>
            </FormControl>
          </VStack>

          <Box alignSelf="flex-end">
            <LabelButton
              color="primary.400"
              fontSize="sm"
              onPress={() => navigation.navigate(ROUTES.FORGET_PASSWORD)}
            >
              {`${t("Forget password")}?`}
            </LabelButton>
          </Box>
        </VStack>

        {/* @ts-ignore */}
        <Button variant="primary" onPress={handleLogin}>
          {t("Login")}
        </Button>

        <HStack
          justifyContent="space-between"
          alignSelf="center"
          width="50%"
          mt={6}
        >
          <GoogleButton onPress={handleSocialLogin} />
          <AppleButton onPress={handleSocialLogin} />
          <FacebookButton onPress={handleSocialLogin} />
        </HStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
