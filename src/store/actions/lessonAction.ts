import { Dispatch } from "@states/ReduxAction";
import API, { getError } from "../api";

/* Action types */

export const FETCH_LESSONS_START = "FETCH_LESSONS_START";
export const FETCH_LESSONS_SUCCESS = "FETCH_LESSONS_SUCCESS";
export const FETCH_LESSONS_ERROR = "FETCH_LESSONS_ERROR";
export const FETCH_BOOKMARKS_SUCCESS = "FETCH_BOOKMARKS_SUCCESS";
export const FETCH_LESSON_DETAIL_SUCCESS = "FETCH_LESSON_DETAIL_SUCCESS";
export const FETCH_CONFIG_SUCCESS = "FETCH_CONFIG_SUCCESS";
export const FETCH_FREE_CONTENT_SUCCESS = "FETCH_FREE_CONTENT_SUCCESS";

export const ADD_BOOKMARK = "ADD_BOOKMARK";
export const REMOVE_BOOKMARK = "REMOVE_BOOKMARK";
export const SET_LESSON_PURCHASE = "SET_LESSON_PURCHASE";

/* Actions */

const fetchLessonStart = () => ({
  type: FETCH_LESSONS_START,
});

const fetchLessonError = () => ({
  type: FETCH_LESSONS_ERROR,
});

const fetchLessonSuccess = (data: {
  tabId: number;
  data: any;
  count: number;
}) => ({
  type: FETCH_LESSONS_SUCCESS,
  payload: data,
});

const fetchBookmarkSuccess = (data: any) => ({
  type: FETCH_BOOKMARKS_SUCCESS,
  payload: data,
});

const addBookmarkSuccess = (data: any) => ({
  type: ADD_BOOKMARK,
  payload: data,
});

const removeBookmarkSuccess = (data: any) => ({
  type: REMOVE_BOOKMARK,
  payload: data,
});

const fetchLessonDetailSuccess = (data: any) => ({
  type: FETCH_LESSON_DETAIL_SUCCESS,
  payload: data,
});

const fetchConfigSuccess = (data: any) => ({
  type: FETCH_CONFIG_SUCCESS,
  payload: data,
});

const fetchFreeContentSuccess = (data: any) => ({
  type: FETCH_FREE_CONTENT_SUCCESS,
  payload: data,
});

export const setLessonPurchase = (
  purchase: {
    productId: string;
    orderId: string;
  }[]
) => ({
  type: SET_LESSON_PURCHASE,
  payload: purchase,
});

/* Async actions */

export const fetchLessonConfig = () => async (dispatch: Dispatch) => {
  try {
    const { data } = await API.get("/categories?_sort=id:ASC");
    dispatch(fetchConfigSuccess(data));
    return {
      success: true,
    };
  } catch (error) {
    const message = getError(error);
    dispatch(fetchLessonError());

    return {
      success: false,
      message,
    };
  }
};

export const fetchLesson =
  (tabId: number, page?: number) => async (dispatch: Dispatch) => {
    dispatch(fetchLessonStart());
    try {
      let response: any = {};
      let count = 0;

      if (tabId === 1) {
        response = await API.get("/home");
      } else if (tabId === 2) {
        response = await API.get("/premiumclub");
      } else if (tabId === 3) {
        response = await API.get("/bookclub");
      } else if (tabId === 4) {
        const limit = 10;
        const start = page ? limit * page + 1 : 1;
        const collectionId = 3;

        response = await API.get(
          `/lessons?_sort=created_at:ASC&_start=${start}&_limit=${limit}&lesson_collection=${collectionId}`
        );
        // get total at init
        if (page === 1 || !page) {
          const countRes = await API.get(
            `/lessons/count?lesson_collection=${collectionId}`
          );

          if (countRes) {
            count = countRes.data;
          }
        }
      }

      dispatch(fetchLessonSuccess({ tabId, data: response.data, count }));
      return {
        success: true,
        data: response.data,
        // count: count,
      };
    } catch (error) {
      const message = getError(error);
      dispatch(fetchLessonError());

      return {
        success: false,
        message,
      };
    }
  };

export const fetchFreeContent = () => async (dispatch: Dispatch) => {
  try {
    const { data } = await API.get(`/free`);
    dispatch(fetchFreeContentSuccess(data));
    return {
      success: true,
    };
  } catch (error) {
    const message = getError(error);
    return {
      success: false,
      message,
    };
  }
};

export const fetchBookmark = (userId: number) => async (dispatch: Dispatch) => {
  try {
    const { data } = await API.get(`/bookmarks?user.id=${userId}`);
    dispatch(fetchBookmarkSuccess(data));
    return {
      success: true,
    };
  } catch (error) {
    const message = getError(error);
    return {
      success: false,
      message,
    };
  }
};

export const addBookmark =
  (userId: number, lessonId: string) => async (dispatch: Dispatch) => {
    try {
      const { data }: any = await API.post(`/bookmarks`, {
        user: userId,
        lesson: lessonId,
      });
      dispatch(addBookmarkSuccess(data));
      return {
        success: true,
        data,
      };
    } catch (error) {
      const message = getError(error);
      return {
        success: false,
        message,
      };
    }
  };

export const removeBookmark =
  (bookmarkId: string) => async (dispatch: Dispatch) => {
    try {
      const { data }: any = await API.delete(`/bookmarks/${bookmarkId}`);
      dispatch(removeBookmarkSuccess(data));
      return {
        success: true,
        data,
      };
    } catch (error) {
      const message = getError(error);
      return {
        success: false,
        message,
      };
    }
  };

export const fetchLessonDetail =
  (lessonId: string) => async (dispatch: Dispatch) => {
    try {
      const { data }: any = await API.get(`/lessons/${lessonId}`);
      dispatch(fetchLessonDetailSuccess(data));
      return {
        success: true,
        data,
      };
    } catch (error) {
      const message = getError(error);
      return {
        success: false,
        message,
      };
    }
  };

export const fetchLessonPurchase =
  (userId: number) => async (dispatch: Dispatch) => {
    try {
      const { data } = await API.get(
        `/lesson-purchases?_sort=created_at:DESC&user=${userId}`
      );
      dispatch(setLessonPurchase(data));
    } catch (error) {
      const message = getError(error);
      return message;
    }
  };
