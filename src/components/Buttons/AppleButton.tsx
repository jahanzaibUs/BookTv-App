import React from "react";
import * as AppleAuthentication from "expo-apple-authentication";
import AuthBaseButton from "./AuthBaseButton";

interface AppleButtonProps {
  disabled?: boolean;
  onPress?: (data: any) => void;
}

export default function AppleButton({ onPress, ...rest }: AppleButtonProps) {
  const [suppported, setSuppported] = React.useState(false);
  React.useEffect(() => {
    const checkSupport = async () => {
      const status = await AppleAuthentication.isAvailableAsync();
      setSuppported(status);
    };

    checkSupport();
  }, []);

  const appleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      console.log(credential);
      if (onPress) {
        onPress({ provider: "apple", token: credential.authorizationCode });
      }
    } catch (error: any) {
      if (error.code === "ERR_CANCELED") {
        console.log("cancelled");
      } else {
        console.log("Apple login fail: " + error);
      }
    }
  };

  if (suppported) {
    return (
      <AuthBaseButton
        name="apple"
        backgroundColor="black"
        onPress={appleSignIn}
        {...rest}
      />
    );
  }
  return null;
}
