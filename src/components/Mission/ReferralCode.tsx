import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { Text, Input } from "native-base";
import * as Clipboard from "expo-clipboard";

import { t } from "@utils/i18n";

interface ReferralCodeProps {
  value: string;
  label?: string;
}

export default function ReferralCode({ value, label }: ReferralCodeProps) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 4000);
    }
  }, [isCopied]);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(value);
    setIsCopied(true);
  };

  return (
    <Input
      variant="rounded"
      editable={false}
      value={value}
      fontSize="sm"
      InputRightElement={
        <TouchableOpacity onPress={copyToClipboard}>
          <Text fontSize="sm" color="primary.600" mr={4}>
            {isCopied
              ? t("Copied")
              : `${t("Copy")}${t(label || "Referral Code")}`}
          </Text>
        </TouchableOpacity>
      }
      width="240px"
      alignSelf="center"
      px={4}
      mt={3}
    />
  );
}
