import crashlytics from "@react-native-firebase/crashlytics";
import API, { getError } from "@store/api";

export const sendConfirmation = async (email: string) => {
  try {
    const response: any = await API.post(`/auth/send-email-confirmation`, {
      email,
    });
    return {
      success: response.status === 200,
    };
  } catch (error: any) {
    crashlytics().recordError(error);
    return {
      success: false,
    };
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response: any = await API.post(`/auth/forgot-password`, {
      email,
    });
    return {
      success: response.status === 200,
    };
  } catch (error: any) {
    crashlytics().recordError(error);
    return {
      success: false,
    };
  }
};

export const resetPassword = async (form: {
  code: string;
  password: string;
}) => {
  try {
    const response: any = await API.post(`/auth/reset-password`, {
      code: form.code, // code in the reset link
      password: form.password,
      passwordConfirmation: form.password,
    });
    return {
      success: response.status === 200,
    };
  } catch (error: any) {
    crashlytics().recordError(error);
    const message = getError(error);
    return {
      success: false,
      message,
    };
  }
};
