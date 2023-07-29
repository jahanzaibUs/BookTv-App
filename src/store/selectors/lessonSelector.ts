import { createSelector } from "reselect";
import { RootState } from "../states/RootState";

const getLessonsState = (state: RootState) => state.lesson;

const getSaved = createSelector(
  getLessonsState,
  (lessonState) => lessonState.bookmarks
);

export const getLessons = createSelector(
  getLessonsState,
  getSaved,
  (lessonState, bookmarks) => {
    return lessonState.lessons.map((item) => ({
      ...item,
      bookmark_id: bookmarks.find((bm) => bm.lesson.id === item.id)?.id || null,
    }));
  }
);

// default in SearchScreen
export const getNewLessons = createSelector(getLessons, (lessons) =>
  lessons.filter((item) => item.is_new)
);

export const getBookmarks = createSelector(getLessonsState, (lessonState) =>
  lessonState.bookmarks.map((b) => ({ ...b.lesson, bookmark_id: b.id }))
);

export const getCategories = createSelector(
  getLessonsState,
  (lessonState) => lessonState.categories
);

export const getCurrentLesson = createSelector(
  getLessonsState,
  (lessonState) => lessonState.currentData
);

export const getUserPurchase = createSelector(
  getLessonsState,
  (lessonState) => lessonState.purchaseHistories
);

export const getHomeFeed = createSelector(getLessonsState, (lessonState) => ({
  home: lessonState.home,
  premiumclub: lessonState.premiumclub,
  bookclub: lessonState.bookclub,
  lessons: lessonState.lessons,
  courseCount: lessonState.courseCount,
}));

export const getFreeData = createSelector(
  getLessonsState,
  (lessonState) => lessonState.free
);
