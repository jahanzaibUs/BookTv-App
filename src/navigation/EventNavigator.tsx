import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import EventIndex from "@screens/event/EventIndex";
import EventDetail from "@screens/event/EventDetail";
import EventList from "@screens/event/EventList";
import WebEvent from "@screens/order/WebEvent";
import IconButton from "@components/IconButton";
import { TabTwoParamList } from "@typings/navigation";
import { t } from "@utils/i18n";
import { getScreenOptions } from "./ScreenOptions";
import ROUTES from "./Routes";

const EventStack = createStackNavigator<TabTwoParamList>();

export default function EventNavigator() {
  return (
    <EventStack.Navigator screenOptions={getScreenOptions()}>
      <EventStack.Screen
        name={ROUTES.EVENT_INDEX}
        component={EventIndex}
        options={{ headerTitle: t("Event") }}
      />
      <EventStack.Screen
        name={ROUTES.EVENT_DETAIL}
        component={EventDetail}
        options={({ navigation }) => ({
          headerTransparent: true,
          headerTintColor: "#fff",
          title: "",
          headerLeft: () => (
            <IconButton
              family="MaterialCommunityIcons"
              name="chevron-left-circle"
              color="primary.600"
              size="md"
              onPress={() => navigation.goBack()}
            />
          ),
        })}
      />
      <EventStack.Screen name={ROUTES.EVENT_LIST} component={EventList} />
      <EventStack.Screen
        name={ROUTES.WEB_EVENT}
        component={WebEvent}
        options={{ headerTitle: "" }}
      />
    </EventStack.Navigator>
  );
}
