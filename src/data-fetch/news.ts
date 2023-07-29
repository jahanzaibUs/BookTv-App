import API, { getError } from "@store/api";

export const fetchNews = async () => {
  try {
    const { data }: any = await API.get(`/newsletters?_sort=created_at:DESC`);
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

export const fetchNewsDetail = async (id: string) => {
  try {
    const { data }: any = await API.get(`/newsletters/${id}`);
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
