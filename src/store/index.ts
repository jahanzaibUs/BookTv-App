import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

import rootReducer from "./reducers/root";

// Only persist feed
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["event", "lesson", "notification"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middlewares = [thunk];

const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(...middlewares))
);

const persistor = persistStore(store);

export { store, persistor };
