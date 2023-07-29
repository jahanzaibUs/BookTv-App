import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { TabTwoParamList } from "@typings/navigation";
import { t } from "@utils/i18n";
import { getScreenOptions } from "./ScreenOptions";
import ROUTES from "./Routes";
import NewsIndex from "@screens/news/NewsIndex";
import NewsDetail from "@screens/news/NewsDetail";

const NewsStack = createStackNavigator<TabTwoParamList>();

export default function NewsNavigator() {
  return (
    <NewsStack.Navigator screenOptions={getScreenOptions()}>
      <NewsStack.Screen
        name={ROUTES.NEWS_INDEX}
        component={NewsIndex}
        options={{ headerTitle: t("News") }}
      />
      <NewsStack.Screen
        name={ROUTES.NEWS_DETAIL}
        component={NewsDetail}
        options={{ headerTitle: t("News") }}
      />
    </NewsStack.Navigator>
  );
}
