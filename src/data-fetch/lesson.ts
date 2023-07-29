import API, { getError } from "@store/api";
import { SearchOption } from "@states/LessonState";

export const fetchLessonByCategory = async (catId: number) => {
  try {
    const { data }: any = await API.get(`/lessons?category=${catId}`);
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

export const fetchLessonDetail = async (lessonId: string) => {
  try {
    const { data }: any = await API.get(`/lessons/${lessonId}`);
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

export const searchLesson = async (option: SearchOption) => {
  try {
    const { keyword, category, priceRange, audio, video, sort } = option;
    let url = `/lessons?`;

    if (keyword) {
      url += `title_contains=${keyword}`;
    }
    if (category) {
      category.forEach((c) => {
        url += `&category.id=${c}`;
      });
    }
    if (priceRange) {
      url += `&price_gte=${priceRange[0]}&price_lte=${priceRange[1]}`;
    }
    if (sort) {
      url += `&_sort=created_at:DESC`;
    }

    const { data }: any = await API.get(url);
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

export const updateLikeUser = async (lessonId: string, userIds: number[]) => {
  try {
    const { data }: any = await API.put(`/lessons/${lessonId}`, {
      like_users: userIds,
    });
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

export const updateLessonProgress = async (progress: {
  lessonId: string;
  mediaId: number;
  timestamp: number;
}) => {
  try {
    const { data }: any = await API.post(`/lesson-progresses`, {
      lesson: progress.lessonId,
      media: progress.mediaId,
      timestamp: progress.timestamp,
    });
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
