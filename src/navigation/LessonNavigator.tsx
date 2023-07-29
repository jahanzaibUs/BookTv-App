import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { TabTwoParamList } from "@typings/navigation";
import { getScreenOptions } from "./ScreenOptions";
import ROUTES from "./Routes";
import LessonDetail from "@screens/lesson/LessonDetail";
import PdfReader from "@screens/lesson/PdfReader";

const LessonStack = createStackNavigator<TabTwoParamList>();

export default function LessonNavigator() {
  return (
    <LessonStack.Navigator screenOptions={{}}>
      <LessonStack.Screen
        name={ROUTES.VIDEO_LESSON}
        component={LessonDetail}
        options={{ headerShown: false }}
      />

      <LessonStack.Screen
        name={ROUTES.PDF_READER}
        component={PdfReader}
        options={{ headerTitle: "", ...getScreenOptions() }}
      />
    </LessonStack.Navigator>
  );
}
