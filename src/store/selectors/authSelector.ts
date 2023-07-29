import { createSelector } from "reselect";
import { RootState } from "../states/RootState";

const getAuthState = (state: RootState) => state.auth;

export const getProfile = createSelector(
  getAuthState,
  (authState) => authState.profile
);

export const getUserSubscriptions = createSelector(
  getAuthState,
  (authState) => ({
    isVIP: authState.activeSubscription === "T3",
    activeSubscription: authState.activeSubscription,
    subscriptionHistories: authState.subscription,
  })
);
