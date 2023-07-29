/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import * as React from "react";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { connect } from "react-redux";
import { useColorMode } from "native-base";

import MiniPlayer from "@components/Video/MiniPlayer";
import { RootState } from "@states/RootState";
import { BottomTabParamList } from "@typings/navigation";
import HomeNavigator from "./HomeNavigator";
import MissionNavigator from "./MissionNavigator";
import EventNavigator from "./EventNavigator";
import NewsNavigator from "./NewsNavigator";
import AccountNavigator from "./AccountNavigator";
import LessonNavigator from "./LessonNavigator";
import ROUTES from "./Routes";

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

function getTabBarVisible(route: any) {
  const routeName = route ? route.name : "Home";

  switch (routeName) {
    case ROUTES.LESSON_INTRO:
      return false;
    case ROUTES.LESSON_TAB:
      return false;
    case ROUTES.VIDEO_LESSON:
      return false;
    case ROUTES.PDF_READER:
      return false;
    case ROUTES.EVENT_DETAIL:
      return false;
    case ROUTES.CHAT:
      return false;
    default:
      return true;
  }
}

interface Props {
  authenticated: boolean;
}

function BottomTabNavigator({ authenticated }: Props) {
  const { colorMode } = useColorMode();

  return (
    <BottomTab.Navigator
      initialRouteName={ROUTES.HOME_TAB}
      tabBarOptions={{
        activeTintColor: "#FF7500",
        inactiveTintColor: "#C6C6C6",
        style: {
          backgroundColor: colorMode === "dark" ? "#1f2937" : "#fff",
        },
      }}
      screenOptions={({ route }) => ({
        tabBarLabel: tabBarLabels[route.name],
        tabBarIcon: ({ focused, color }) => {
          return (
            <TabBarIcon
              routeName={route.name}
              focused={focused}
              color={color}
            />
          );
        },
      })}
    >
      <BottomTab.Screen
        name={ROUTES.HOME_TAB}
        component={HomeNavigator}
        options={({ route }) => ({
          tabBarVisible: getTabBarVisible(route),
        })}
      />
      <BottomTab.Screen
        name={ROUTES.MISSION}
        component={MissionNavigator}
        options={({ route }) => ({
          tabBarVisible: getTabBarVisible(route),
        })}
      />
      <BottomTab.Screen
        name={ROUTES.NEWS_TAB}
        component={NewsNavigator}
        options={({ route }) => ({
          tabBarVisible: getTabBarVisible(route),
        })}
      />
      <BottomTab.Screen name={ROUTES.EVENT_TAB} component={EventNavigator} />
      <BottomTab.Screen
        name={ROUTES.ACCOUNT_TAB}
        component={AccountNavigator}
        options={({ route }) => ({
          tabBarVisible: getTabBarVisible(route),
        })}
      />
      <BottomTab.Screen
        name={ROUTES.LESSON_TAB}
        component={LessonNavigator}
        options={({ route }) => ({
          tabBarVisible: getTabBarVisible(route),
          tabBarButton: () => <MiniPlayer />,
        })}
      />
    </BottomTab.Navigator>
  );
}

export default connect((state: RootState) => ({
  authenticated: state.auth.authenticated,
}))(BottomTabNavigator);

// Icons library: https://icons.expo.fyi/
const tabBarIcons: {
  [key: string]: React.ComponentProps<typeof Ionicons>["name"];
} = {
  [ROUTES.HOME_TAB]: "book",
  [ROUTES.MISSION]: "gift-sharp",
  [ROUTES.NEWS_TAB]: "notifications",
  [ROUTES.EVENT_TAB]: "ios-calendar",
  [ROUTES.ACCOUNT_TAB]: "person",
};

const TabBarIcon = (props: {
  routeName: keyof BottomTabParamList;
  color: string;
  focused: boolean;
}) => {
  return (
    <Ionicons
      size={26}
      style={{ marginBottom: -3 }}
      name={tabBarIcons[props.routeName]}
      color={props.color}
      focused={props.focused}
    />
  );
};

const tabBarLabels: {
  [key: string]: string;
} = {
  [ROUTES.HOME_TAB]: "主頁",
  [ROUTES.MISSION]: "任務系統",
  [ROUTES.NEWS_TAB]: "公告",
  [ROUTES.EVENT_TAB]: "活動",
  [ROUTES.ACCOUNT_TAB]: "帳戶",
};
