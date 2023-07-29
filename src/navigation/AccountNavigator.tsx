import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { TabTwoParamList } from "@typings/navigation";
import { t } from "@utils/i18n";
import ROUTES from "./Routes";
import { getScreenOptions } from "./ScreenOptions";
import AccountIndex from "@screens/account/AccountIndex";
import BookmarkScreen from "@screens/account/BookmarkScreen";
import NoteEditor from "@screens/lesson/NoteEditor";
import PurchaseRecord from "@screens/account/PurchaseRecord";
import MembershipPlan from "@screens/account/MembershipPlan";
import PaymentRedirect from "@screens/order/PaymentRedirect";
import ChatScreen from "@screens/account/ChatScreen";
import EditProfile from "@screens/account/EditProfile";
import NotificationSetting from "@screens/account/NotificationSetting";
import ThemeSetting from "@screens/account/ThemeSetting";
import TermsAndConditions from "@screens/account/TermsAndConditions";

const AccountStack = createStackNavigator<TabTwoParamList>();

export default function AccountNavigator() {
  return (
    <AccountStack.Navigator
      screenOptions={getScreenOptions()}
      initialRouteName={ROUTES.ACCOUNT_INDEX}
    >
      <AccountStack.Screen
        name={ROUTES.ACCOUNT_INDEX}
        component={AccountIndex}
        options={{
          headerTitle: "",
        }}
      />
      <AccountStack.Screen
        name={ROUTES.BOOKMARK}
        component={BookmarkScreen}
        options={{
          headerTitle: t("Bookmark"),
        }}
      />
      <AccountStack.Screen
        name={ROUTES.PURCHASE_RECORD}
        component={PurchaseRecord}
        options={{
          headerTitle: t("Purchase Record"),
        }}
      />
      <AccountStack.Screen
        name={ROUTES.MEMBERSHIP_PLAN}
        component={MembershipPlan}
        options={{
          headerTitle: "",
        }}
      />
      <AccountStack.Screen
        name={ROUTES.NOTIFICATION_SETTINGS}
        component={NotificationSetting}
        options={{
          headerTitle: t("Push Notifications"),
        }}
      />
      <AccountStack.Screen
        name={ROUTES.THEME_SETTINGS}
        component={ThemeSetting}
        options={{
          headerTitle: t("THEME"),
        }}
      />
      <AccountStack.Screen
        name={ROUTES.CHAT}
        component={ChatScreen}
        options={{
          headerTitle: t("Customer Service"),
        }}
      />
      <AccountStack.Screen
        name={ROUTES.EDIT_PROFILE}
        component={EditProfile}
        options={{
          headerTitle: t("Edit Profile"),
        }}
      />
      <AccountStack.Screen
        name={ROUTES.NOTE_EDITOR}
        component={NoteEditor}
        options={{ headerTitle: t("Notes") }}
      />
      <AccountStack.Screen
        name={ROUTES.WEB_PAYMENT}
        component={PaymentRedirect}
        options={{ headerTitle: "" }}
      />
      <AccountStack.Screen
      name={ROUTES.TERMS_AND_CONDITIONS}
      component={TermsAndConditions}
      options={{ headerTitle: "" }}
      />
    </AccountStack.Navigator>
  );
}
