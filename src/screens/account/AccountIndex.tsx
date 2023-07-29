import React from "react";

import UserAccount from "./UserAccount";
import GuestPage from "./GuestPage";
import useToken from "@hooks/useToken";

interface AccountIndexProps {
  navigation: any;
}

export default function AccountIndex({ navigation }: AccountIndexProps) {
  const token = useToken();

  if (token) {
    return <UserAccount navigation={navigation} />;
  }
  return <GuestPage navigation={navigation} />;
}
