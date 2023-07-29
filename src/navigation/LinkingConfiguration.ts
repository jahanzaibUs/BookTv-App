/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import ROUTES from "@navigation/Routes";

export default {
  prefixes: ["booktvhk://"],
  config: {
    screens: {
      [ROUTES.ROOT]: {
        screens: {
          [ROUTES.HOME_TAB]: {
            initialRouteName: ROUTES.HOME_INDEX,
            screens: {
              [ROUTES.LESSON_INTRO]: "lesson/:id",
            },
          },
          [ROUTES.NEWS_TAB]: {
            initialRouteName: ROUTES.NEWS_INDEX,
            screens: {
              [ROUTES.NEWS_DETAIL]: "newsletter/:id",
            },
          },
          [ROUTES.EVENT_TAB]: {
            initialRouteName: ROUTES.EVENT_INDEX,
            screens: {
              [ROUTES.EVENT_DETAIL]: "event/:id",
            },
          },
          [ROUTES.MISSION]: {
            initialRouteName: ROUTES.MISSION,
            screens: {
              [ROUTES.REDEEM_GIFT]: "redeem",
            },
          },
        },
      },
      [ROUTES.SIGNUP]: "invite",
      [ROUTES.RESET_PASSWORD]: "reset-password",
      [ROUTES.NOT_FOUND]: "*",
    },
  },
};
