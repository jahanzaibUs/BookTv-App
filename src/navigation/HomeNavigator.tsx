import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { TabOneParamList } from "@typings/navigation";
import { t } from "@utils/i18n";
import { getScreenOptions, withoutBorderStyle } from "./ScreenOptions";
import ROUTES from "./Routes";
import HomeScreen from "@screens/home/HomeScreen";
import LessonIntro from "@screens/lesson/LessonIntro";
import FreeContent from "@screens/lesson/FreeContent";
import MoreContent from "@screens/lesson/MoreContent";
import NoteEditor from "@screens/lesson/NoteEditor";
import NotificationScreen from "@screens/home/NotificationScreen";
import SearchScreen from "@screens/home/SearchScreen";
import NewsDetail from "@screens/news/NewsDetail";
import MembershipIntro from "@screens/home/MembershipIntro";

const HomeStack = createStackNavigator<TabOneParamList>();

export default function HomeNavigator() {
  return (
    <HomeStack.Navigator
      screenOptions={getScreenOptions()}
      initialRouteName={ROUTES.HOME_INDEX}
    >
      <HomeStack.Screen
        name={ROUTES.HOME_INDEX}
        component={HomeScreen}
        options={{
          headerTitle: "",
          headerStyle: {
            height: 50,
            ...withoutBorderStyle,
          },
        }}
      />
      <HomeStack.Screen
        name={ROUTES.LESSON_INTRO}
        component={LessonIntro}
        options={{ headerTitle: "" }}
      />
      <HomeStack.Screen name={ROUTES.BROWSE_ALL} component={MoreContent} />
      <HomeStack.Screen name={ROUTES.FREE_INDEX} component={FreeContent} />
      <HomeStack.Screen
        name={ROUTES.MEMBERSHIP_INTRO}
        component={MembershipIntro}
        options={{ headerTitle: "" }}
      />
      <HomeStack.Screen
        name={ROUTES.NOTE_EDITOR}
        component={NoteEditor}
        options={{ headerTitle: t("Notes") }}
      />
      <HomeStack.Screen
        name={ROUTES.NOTIFICATION}
        component={NotificationScreen}
        options={{ headerTitle: t("Notifications") }}
      />
      <HomeStack.Screen
        name={ROUTES.SEARCH}
        component={SearchScreen}
        options={{ headerTitle: "" }}
      />
      <HomeStack.Screen
        name={ROUTES.NEWS_DETAIL}
        component={NewsDetail}
        options={{ headerTitle: t("News") }}
      />
    </HomeStack.Navigator>
  );
}
