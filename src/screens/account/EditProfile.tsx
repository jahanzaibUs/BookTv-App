import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  Linking,
  Platform,
  TouchableOpacity,
} from "react-native";
import {
  KeyboardAvoidingView,
  ScrollView,
  VStack,
  Button,
  FormControl,
  Input,
  Avatar,
  Box,
  useToast,
} from "native-base";
import * as ImagePicker from "expo-image-picker";

import { t } from "@utils/i18n";
import { getProfile } from "@selectors/authSelector";
import { updateUserData } from "@actions/authAction";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { emailRegex, phoneRegex } from "@utils/regex";

interface EditProfileProps {
  navigation: any;
}

export default function EditProfile({ navigation }: EditProfileProps) {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(getProfile);
  const toast = useToast();
  const [username, setUsername] = useState(profile.username);
  const [email, setEmail] = useState(profile.email);
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<string | null>(`${profile.avatar}`);
  const [phone, setPhone] = useState(profile.phone);
  const [errors, setErrors] = useState<{
    username: boolean;
    email: boolean;
    phone: boolean;
    password: boolean;
  }>({
    username: false,
    email: false,
    phone: false,
    password: false,
  });

  const validate = () => {
    let nextErrs = {
      username: username.trim().length < 6,
      email: !emailRegex.test(email),
      phone: !phoneRegex.test(phone),
      password: password.trim().length < 8 && password.trim().length !== 0,
    };
    setErrors(nextErrs);
    return !Object.values(nextErrs).includes(true);
  };

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(t("PHOTO_PERMISSION_ALERT"), "", [
        {
          text: t("Later"),
          onPress: () => {},
          style: "cancel",
        },
        {
          text: t("Settings"),
          onPress: () => Linking.openSettings(),
        },
      ]);
    }
  };

  const pickImage = async () => {
    await requestPermission();

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setAvatar(result.uri);
    }
  };

  const onConfirm = async () => {
    Keyboard.dismiss();
    if (!validate()) {
      return;
    }

    const { success } = await dispatch(
      updateUserData(profile.id, {
        username,
        email,
        phone,
        password,
        avatar,
      })
    );

    toast.show({
      description: success ? t("Updated") : t("REFRESH_ERROR"),
      status: success ? "success" : "error",
      isClosable: false,
    });
    if (success) {
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Platform.OS === "ios" ? 95 : 50}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      flex={1}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        _contentContainerStyle={{ p: 5 }}
      >
        <VStack justifyContent="space-between" mb={5}>
          <Box alignSelf="center" my={3}>
            <TouchableOpacity onPress={pickImage}>
              <Avatar
                source={
                  avatar
                    ? { uri: avatar }
                    : require("@assets/images/avatar-placeholder.jpg")
                }
                size="2xl"
                shadow={1}
                bg="white"
              />
            </TouchableOpacity>
          </Box>

          <VStack>
            <FormControl mb={4} isInvalid={errors.email}>
              <FormControl.Label>{t("Email")}</FormControl.Label>
              <Input
                variant="rounded"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={(val) => setEmail(val)}
                editable={false}
              />
              <FormControl.ErrorMessage>
                {t("Invalid email")}
              </FormControl.ErrorMessage>
            </FormControl>

            <FormControl mb={4} isInvalid={errors.username}>
              <FormControl.Label>{t("Username")}</FormControl.Label>
              <Input
                variant="rounded"
                value={username}
                onChangeText={(val) => setUsername(val)}
              />
              <FormControl.ErrorMessage>
                {t("shortUsername")}
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
                variant="rounded"
                secureTextEntry
                placeholder="********"
                value={password}
                onChangeText={(val) => setPassword(val)}
              />
              <FormControl.ErrorMessage>
                {t("shortPassword")}
              </FormControl.ErrorMessage>
            </FormControl>
          </VStack>
        </VStack>

        {/* @ts-ignore */}
        <Button variant="secondary" shadow={0} onPress={onConfirm}>
          {t("Done")}
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
