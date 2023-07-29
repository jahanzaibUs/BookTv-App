import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { TabTwoParamList } from "@typings/navigation";
import { t } from "@utils/i18n";
import { getScreenOptions } from "./ScreenOptions";
import ROUTES from "./Routes";
import MissionScreen from "@screens/account/MissionScreen";
import RedeemGift from "@screens/mission/RedeemGift";

const MissionStack = createStackNavigator<TabTwoParamList>();

export default function MissionNavigator() {
  return (
    <MissionStack.Navigator screenOptions={getScreenOptions()}>
      <MissionStack.Screen
        name={ROUTES.MISSION}
        component={MissionScreen}
        options={{ headerTitle: t("Quest") }}
      />
      <MissionStack.Screen
        name={ROUTES.REDEEM_GIFT}
        component={RedeemGift}
        options={{ headerTitle: t("") }}
      />
    </MissionStack.Navigator>
  );
}
