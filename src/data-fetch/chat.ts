import API, { getError } from "@store/api";

export const fetchChatMessage = async (userId: number) => {
  try {
    const { data }: any = await API.get(
      `/chat/messages?user=${userId}&_sort=created_at:DESC`
    );
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
