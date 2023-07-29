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
  Checkbox,
  useToast,
} from "native-base";

import { t } from "@utils/i18n";
import ROUTES from "@navigation/Routes";
import { useAppDispatch } from "@hooks/redux";
import { register } from "@actions/authAction";
import IconButton from "@components/IconButton";
import { emailRegex, phoneRegex } from "@utils/regex";

interface SignupProps {
  navigation: any;
  route: any;
}

export default function Signup({ navigation, route }: SignupProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password2Visible, setPassword2Visible] = useState(false);
  const [terms, acceptTerms] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [errors, setErrors] = useState<{
    username: boolean;
    email: boolean;
    phone: boolean;
    password: boolean;
    password2: boolean;
    terms: boolean;
  }>({
    username: false,
    email: false,
    phone: false,
    password: false,
    password2: false,
    terms: false,
  });
  const dispatch = useAppDispatch();
  const toast = useToast();

  useEffect(() => {
    if (route.params && route.params.code) {
      setReferralCode(route.params.code);
    }
  }, [route]);

  useEffect(() => {
    if (Object.values(errors).includes(true)) {
      validate();
    }
  }, [terms, username, email, password]);

  const validate = () => {
    let nextErrs = {
      username: username.trim().length < 6,
      email: !emailRegex.test(email),
      phone: !phoneRegex.test(phone),
      password: password.trim().length < 8,
      password2: password !== password2,
      terms: !terms,
    };
    setErrors(nextErrs);
    return !Object.values(nextErrs).includes(true);
  };

  const togglePassword = () => setPasswordVisible(!passwordVisible);

  const togglePassword2 = () => setPassword2Visible(!password2Visible);

  const goToVerify = () => {
    navigation.navigate(ROUTES.VERIFY_EMAIL, { email });
  };

  const handleSignup = async () => {
    Keyboard.dismiss();
    if (!validate()) {
      return;
    }
    const result = await dispatch(
      register({ username, email, phone, password, referralCode })
    );

    if (result.authenticated) {
      goToVerify();
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
            <FormControl mb={4} isInvalid={errors.username}>
              <FormControl.Label>{t("Username")}</FormControl.Label>
              <Input
                value={username}
                onChangeText={(val) => setUsername(val)}
                variant="rounded"
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus
              />
              <FormControl.ErrorMessage>
                {t("shortUsername")}
              </FormControl.ErrorMessage>
            </FormControl>

            <FormControl mb={4} isInvalid={errors.email}>
              <FormControl.Label>{t("Email")}</FormControl.Label>
              <Input
                value={email}
                onChangeText={(val) => setEmail(val)}
                variant="rounded"
                placeholder="someone@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <FormControl.ErrorMessage>
                {t("invalidEmail")}
              </FormControl.ErrorMessage>
            </FormControl>

            <FormControl mb={4} isInvalid={errors.phone}>
              <FormControl.Label>{t("Mobile Phone")}</FormControl.Label>
              <Input
                value={phone}
                onChangeText={(val) => setPhone(val)}
                variant="rounded"
                keyboardType="phone-pad"
              />
              <FormControl.ErrorMessage>
                {t("invalidPhone")}
              </FormControl.ErrorMessage>
            </FormControl>

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

            <FormControl mb={4}>
              <FormControl.Label>{t("Referral Code")}</FormControl.Label>
              <Input
                value={referralCode}
                onChangeText={(val) => setReferralCode(val)}
                variant="rounded"
              />
            </FormControl>
          </VStack>

          <Box alignSelf="flex-start">
            <FormControl mb={4} isInvalid={errors.terms}>
              <Checkbox
                name="terms"
                value="accept"
                accessibilityLabel="terms checkbox"
                _text={{
                  fontSize: "sm",
                }}
                _light={{
                  _text: {
                    color: "cyan.900",
                  },
                }}
                _dark={{
                  _text: {
                    color: "cyan.300",
                  },
                }}
                isChecked={terms}
                onChange={(val) => acceptTerms(val)}
              >
                {t("ACCEPT_TERMS")}
              </Checkbox>
              <FormControl.ErrorMessage>
                {t("Required")}
              </FormControl.ErrorMessage>
            </FormControl>
          </Box>
        </VStack>

        {/* @ts-ignore */}
        <Button variant="primary" onPress={handleSignup}>
          {t("Next")}
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
