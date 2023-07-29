/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

export type RootStackParamList = {
  [Root: string]: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  [HomeTab: string]: undefined;
  LessonTab: undefined;
  EventTab: undefined;
  NewsTab: undefined;
  AccountTab: undefined;
};

export type TabOneParamList = {
  [Home: string]: undefined;
};

export type TabTwoParamList = {
  [Lesson: string]: undefined;
};
