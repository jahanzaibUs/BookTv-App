import crashlytics from "@react-native-firebase/crashlytics";
import API, { getError } from "@store/api";

export const fetchEventDetail = async (eventId: string) => {
  try {
    const { data }: any = await API.get(`/events/${eventId}`);
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

export const postEventRegister = async (eventId: string, info: any) => {
  try {
    const { data }: any = await API.post(`/event-registers`, {
      event: eventId,
      amount: info.amount,
      // stripe_payment_id: info.stripe_payment_id,
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

export const cancelEventRegister = async (eventId: string) => {
  try {
    const { data }: any = await API.put(`/event-registers/${eventId}`, {
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
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

export const fetchPaymentSheetParams = async (eventId: string) => {
  try {
    const { data }: any = await API.post(`/events/${eventId}/payment`);
    return {
      success: true,
      data,
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
