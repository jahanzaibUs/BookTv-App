import API, { getError } from "@store/api";

export const fetchMembershipIntro = async () => {
  try {
    const { data }: any = await API.get(`/membership`);
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
