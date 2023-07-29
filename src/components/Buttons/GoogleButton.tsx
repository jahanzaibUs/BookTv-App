import React from "react";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import { GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from "@constants/config";
import AuthBaseButton from "./AuthBaseButton";

interface GoogleButtonProps {
  disabled?: boolean;
  onPress?: (data: any) => void;
}

GoogleSignin.configure({
  offlineAccess: true,
  webClientId: GOOGLE_WEB_CLIENT_ID,
});

export default function GoogleButton({ onPress, ...rest }: GoogleButtonProps) {
  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);

      if (onPress) {
        onPress({ provider: "google", token: userInfo.idToken });
      }
    } catch (error: any) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          console.log("cancelled");
          break;
        case statusCodes.IN_PROGRESS:
          console.log("operation in progress");
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          // android only
          console.log("play services not available or outdated");
          break;
        default:
          console.log("GoogleSignin failed", error);
      }
    }
  };

  return <AuthBaseButton name="google" onPress={googleSignIn} {...rest} />;
}
