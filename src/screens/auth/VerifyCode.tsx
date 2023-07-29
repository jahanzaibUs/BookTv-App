import React, { useState } from "react";
import { Platform, StyleSheet } from "react-native";
import {
  KeyboardAvoidingView,
  ScrollView,
  Box,
  Button,
  Text,
  Heading,
  useToast,
} from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

import { t } from "@utils/i18n";
import ROUTES from "@navigation/Routes";
import LabelButton from "@components/LabelButton";
import { codeRegex } from "@utils/regex";
import { sendConfirmation } from "@data-fetch/auth";
import { confirmCode } from "@actions/authAction";
import { useAppDispatch } from "@hooks/redux";

interface VerifyCodeProps {
  navigation: any;
  route: any;
}

const CELL_COUNT = 5;

export default function VerifyCode({ navigation, route }: VerifyCodeProps) {
  const toast = useToast();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const email = route.params ? route.params.email : "me@email.com";

  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const validate = () => {
    return codeRegex.test(value);
  };

  const submitCode = async () => {
    setLoading(true);
    const { success } = await dispatch(confirmCode(value));

    toast.show({
      description: success ? t("Verified") : t("invalidCode"),
      status: success ? "success" : "error",
      placement: "top",
      isClosable: false,
      duration: 2000
    });
    setVerified(success);
    setLoading(false);

    if (success) {
      setTimeout(() => {
        navigation.reset({ index: 0, routes: [{ name: ROUTES.ROOT }] });
      }, 900);
    }
  };

  const onPressNext = () => {
    if (!validate()) {
      toast.show({
        description: t("invalidCode"),
        placement: "top",
        isClosable: false,
        duration: 2000
      });
      return;
    }

    submitCode();
  };

  const onResendCode = async () => {
    const { success } = await sendConfirmation(email);
    toast.show({
      description: success ? t("SENT_ALERT") : t("SEND_ERROR"),
      status: success ? "success" : "error",
      isClosable: false,
    });
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Platform.OS === "ios" ? 95 : 50}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      backgroundColor="white"
      flex={1}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        _contentContainerStyle={{ p: 5 }}
      >
        <Heading fontSize="2xl" mb={4}>
          {t("VERIFICATION_TITLE")}
        </Heading>
        <Text fontSize="sm">
          {t("VERIFICATION_SUBTITLE")} {email}
        </Text>

        <Box width={0.8} alignSelf="center" flexDirection="column" mb={8}>
          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}
              >
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
          {verified && (
            <MaterialCommunityIcons
              name="check-circle"
              size={22}
              style={{ position: "absolute", right: -22 }}
            />
          )}

          <Box alignSelf="flex-end">
            <LabelButton
              color="primary.400"
              fontSize="sm"
              onPress={onResendCode}
            >
              {t("RESEND_CODE")}
            </LabelButton>
          </Box>
        </Box>

        {/* @ts-ignore */}
        <Button variant="primary" onPress={onPressNext} isLoading={loading}>
          {t("Next")}
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  codeFieldRoot: {
    marginTop: 20,
    marginBottom: 20,
  },
  cell: {
    width: 45,
    height: 55,
    borderRadius: 6,
    fontSize: 24,
    borderWidth: 1,
    borderColor: "#d4d4d8",
    textAlign: "center",
    paddingVertical: 15,
  },
  focusCell: {
    borderColor: "#F5D237",
  },
});
