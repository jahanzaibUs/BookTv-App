import React from "react";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import AuthBaseButton from "./AuthBaseButton";

interface FacebookButtonProps {
  disabled?: boolean;
  onPress?: (data: any) => void;
}

export default function FacebookButton({
  onPress,
  ...rest
}: FacebookButtonProps) {
  const fbSignIn = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        "public_profile",
        "email",
      ]);
      if (result.isCancelled) {
        console.log("cancelled");
      } else if (result.grantedPermissions) {
        console.log(
          "Fbsdk login success: " + result.grantedPermissions.toString()
        );

        const tokenData = await AccessToken.getCurrentAccessToken();
        if (tokenData) {
          console.log(tokenData);
          if (onPress) {
            onPress({ provider: "facebook", token: tokenData.accessToken });
          }
        }
      }
    } catch (error: any) {
      console.log("Fbsdk login fail: " + error);
    }
  };

  return (
    <AuthBaseButton
      name="facebook"
      backgroundColor="#3B5998"
      onPress={fbSignIn}
      {...rest}
    />
  );
}
