import React from "react";
import AuthSheet from "./AuthSheet";

import { useAppSelector } from "@hooks/redux";
import { useAuthSheet } from "@hooks/useAuthSheet";

export default function AuthSheetWrapper() {
  const authSheet = useAuthSheet();
  const { showAuthSheet } = useAppSelector((state) => state.ui);

  return (
    <AuthSheet
      isVisible={showAuthSheet}
      onBackdropPress={() => authSheet.hide()}
    />
  );
}
