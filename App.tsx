import { GestureHandlerRootView } from "react-native-gesture-handler";
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { LogBox } from "react-native";

import { persistor, store } from "./src/store";
import AppCore from "./AppCore";

LogBox.ignoreLogs(["Require cycle", "ViewPropTypes"]);

export default function App() {
  return (
    // @ts-ignore
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppCore />
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}
