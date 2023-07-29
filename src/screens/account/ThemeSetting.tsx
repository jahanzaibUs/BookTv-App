import React, { useState } from "react";
import {
  ScrollView,
  Switch,
  useColorMode,
  StorageManager,
  ColorMode,
} from "native-base";

import { List } from "@components/List";
import { t } from "@utils/i18n";
import { getItem, setItem } from "@utils/storage";
import useColorScheme from "@hooks/useColorScheme";

export const colorModeManager: StorageManager = {
  get: async () => {
    try {
      let val = await getItem("@color-mode");
      return val === "dark" ? "dark" : "light";
    } catch (e) {
      return "light";
    }
  },
  set: async (value: ColorMode) => {
    try {
      await setItem("@color-mode", value);
    } catch (e) {
      console.log(e);
    }
  },
};

export default function ThemeSetting() {
  const { colorMode, toggleColorMode } = useColorMode();
  const deviceTheme = useColorScheme();
  const [useDevice, setUseDevice] = useState(false);

  console.log({ colorMode, deviceTheme });

  const selectDeviceTheme = async () => {
    setUseDevice(!useDevice);
    if (deviceTheme !== colorMode) {
      toggleColorMode();
    }
  };

  const renderSwitch = (key: string) => {
    if (!useDevice) {
      return (
        <Switch
          size="sm"
          onToggle={() => toggleColorMode()}
          isChecked={key === colorMode}
          disabled={useDevice}
        />
      );
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} flex={1} p={5}>
      <List mt={2} shadow={1}>
        <List.Item
          isFirst
          isLast
          disabled
          renderRightComponent={() => (
            <Switch
              size="sm"
              onToggle={() => selectDeviceTheme()}
              isChecked={useDevice}
            />
          )}
        >
          {t("USE_DEVICE_THEME")}
        </List.Item>
      </List>

      <List mt={10} shadow={1}>
        <List.Item
          isFirst
          disabled
          renderRightComponent={() => renderSwitch("light")}
        >
          {t("LIGHT")}
        </List.Item>
        <List.Item
          isLast
          disabled
          renderRightComponent={() => renderSwitch("dark")}
        >
          {t("DARK")}
        </List.Item>
      </List>
    </ScrollView>
  );
}
