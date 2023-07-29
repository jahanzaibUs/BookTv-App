import { ReduxAction } from "../states/ReduxAction";
import { LessonItem, LessonState } from "../states/LessonState";
import {
  FETCH_LESSONS_START,
  FETCH_LESSONS_SUCCESS,
  FETCH_LESSONS_ERROR,
  FETCH_BOOKMARKS_SUCCESS,
  ADD_BOOKMARK,
  REMOVE_BOOKMARK,
  FETCH_LESSON_DETAIL_SUCCESS,
  FETCH_CONFIG_SUCCESS,
  FETCH_FREE_CONTENT_SUCCESS,
  SET_LESSON_PURCHASE,
} from "@actions/lessonAction";

const initialState: LessonState = {
  loading: false,
  categories: [],
  free: null,
  home: null, // 主頁
  premiumclub: null, // 迷你課
  bookclub: null, // 品書會
  lessons: [], // course list
  courseCount: 0,
  bookmarks: [],
  currentData: {
    id: "",
    title: "",
    desc: "",
    overview: "",
    lesson_collection: { id: 0, name: "" },
    creator: "",
    thumbnail: { url: "" },
    category: { id: 0, name: "" },
    duration_total: 0,
    bookmark_id: null,
    is_feature: false,
    is_new: false,
    price: 0,
    photos: null,
    books: [],
    documents: [],
    preview_media: null,
    banner: null,
    media: [],
    comments: [],
    like_users: [],
    product: null,
    purchased: false,
    author: "",
    author_desc: "",
  },
  purchaseHistories: [],
};

const combinePromoItems = (promotions: any) => {
  let combined = [];

  if (promotions.events) {
    combined.push(...promotions.events);
  }
  if (promotions.news) {
    combined.push(...promotions.news);
  }
  if (promotions.lessons) {
    combined.push(...promotions.lessons);
  }
  return combined;
};

const lessonReducer = (
  state = initialState,
  action: ReduxAction
): LessonState => {
  const { type, payload } = action;

  switch (type) {
    case FETCH_LESSONS_START: {
      return {
        ...state,
        loading: true,
      };
    }

    case FETCH_LESSONS_SUCCESS: {
      const { tabId, data, count } = payload;
      let update = {
        ...state,
        loading: false,
      };
      if (tabId === 1) {
        const combinedPromo = combinePromoItems(data.promotions);

        update = {
          ...update,
          home: {
            ...data,
            promotions: combinedPromo,
          },
        };
      } else if (tabId === 2) {
        update = { ...update, premiumclub: data };
      } else if (tabId === 3) {
        const combinedPromo = combinePromoItems(data.promotions);

        update = {
          ...update,
          bookclub: {
            ...data,
            promotions: combinedPromo,
          },
        };
      } else if (tabId === 4 && data) {
        // check pagination duplicates
        let appendLessons: LessonItem[] = [];
        data.forEach((item: LessonItem) => {
          if (!state.lessons.some((d) => d.id === item.id)) {
            appendLessons.push(item);
          }
        });
        update = {
          ...update,
          lessons: [...state.lessons, ...appendLessons],
          courseCount: state.courseCount === 0 ? count : state.courseCount,
        };
      }

      return update;
    }

    case FETCH_LESSONS_ERROR: {
      return {
        ...state,
        loading: false,
      };
    }

    case FETCH_BOOKMARKS_SUCCESS: {
      return {
        ...state,
        bookmarks: payload,
      };
    }

    case ADD_BOOKMARK: {
      return {
        ...state,
        bookmarks: [...state.bookmarks, payload],
      };
    }

    case REMOVE_BOOKMARK: {
      const newBookmarks = state.bookmarks.filter((bm) => bm.id !== payload.id);
      return {
        ...state,
        bookmarks: newBookmarks,
      };
    }

    case FETCH_LESSON_DETAIL_SUCCESS: {
      return {
        ...state,
        currentData: payload,
      };
    }

    case FETCH_CONFIG_SUCCESS: {
      return {
        ...state,
        categories: payload,
      };
    }

    case FETCH_FREE_CONTENT_SUCCESS: {
      return {
        ...state,
        free: payload,
      };
    }

    case SET_LESSON_PURCHASE: {
      if (payload.length && payload.length !== 0) {
        return {
          ...state,
          purchaseHistories: payload,
        };
      } else if (payload.id) {
        return {
          ...state,
          purchaseHistories: [payload, ...state.purchaseHistories],
        };
      }
    }

    default:
      return state;
  }
};

export default lessonReducer;
