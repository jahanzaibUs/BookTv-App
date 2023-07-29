import * as React from "react";
import { useColorMode } from "native-base";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  NavigationContainerRef,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";

import { RootStackParamList } from "@typings/navigation";
import BottomTabNavigator from "./BottomTabNavigator";
import LinkingConfiguration from "./LinkingConfiguration";
import { authScreenOptions, getScreenOptions } from "./ScreenOptions";
import ROUTES from "./Routes";
import { t } from "@utils/i18n";
import NotFoundScreen from "@screens/NotFoundScreen";
import Landing from "@screens/auth/Landing";
import Login from "@screens/auth/Login";
import Signup from "@screens/auth/Signup";
import VerifyCode from "@screens/auth/VerifyCode";
import ForgetPassword from "@screens/auth/ForgetPassword";
import ResetPassword from "@screens/auth/ResetPassword";
import EmptyView from "@components/Container/EmptyView";

export const isReadyRef = React.createRef() as React.MutableRefObject<boolean>;
export const navigationRef = React.createRef<NavigationContainerRef>();

export function navigate(routeName: string, params?: any) {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current.navigate(routeName, params);
  }
}

const CustomDarkTheme = {
  dark: true,
  colors: {
    ...DarkTheme.colors,
    background: "#111827", //"coolGray.900",
    primary: "#1f2937",
  },
};

export default function Navigation({
  authenticated,
}: {
  authenticated: boolean;
}) {
  const { colorMode } = useColorMode();

  React.useEffect(() => {
    return () => {
      isReadyRef.current = false;
    };
  }, []);

  return (
    <>
      <StatusBar style={colorMode === "dark" ? "light" : "light"} />
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          isReadyRef.current = true;
        }}
        linking={LinkingConfiguration}
        fallback={<EmptyView title="LOADING_COURSE" iconName="ios-reload" />}
        theme={colorMode === "dark" ? CustomDarkTheme : DefaultTheme}
      >
        <RootNavigator authenticated={authenticated} />
      </NavigationContainer>
    </>
  );
}

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator({ authenticated }: { authenticated: boolean }) {
  const combinedOptions = {
    ...authScreenOptions,
    ...getScreenOptions(),
  };
  return (
    <Stack.Navigator
      mode="modal"
      screenOptions={{ headerShown: false }}
      initialRouteName={authenticated ? ROUTES.ROOT : ROUTES.LANDING}
    >
      <Stack.Screen name={ROUTES.ROOT} component={BottomTabNavigator} />
      <Stack.Screen
        name={ROUTES.NOT_FOUND}
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
      <Stack.Screen
        name={ROUTES.LANDING}
        component={Landing}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name={ROUTES.SIGNUP}
        component={Signup}
        options={{
          ...combinedOptions,
          title: t("Signup"),
        }}
      />
      <Stack.Screen
        name={ROUTES.LOGIN}
        component={Login}
        options={{
          ...combinedOptions,
          title: "",
        }}
      />
      <Stack.Screen
        name={ROUTES.VERIFY_EMAIL}
        component={VerifyCode}
        options={{
          ...combinedOptions,
          title: "",
        }}
      />
      <Stack.Screen
        name={ROUTES.FORGET_PASSWORD}
        component={ForgetPassword}
        options={{
          ...combinedOptions,
          title: "",
        }}
      />
      <Stack.Screen
        name={ROUTES.RESET_PASSWORD}
        component={ResetPassword}
        options={{
          ...combinedOptions,
          title: "",
        }}
      />
    </Stack.Navigator>
  );
}
