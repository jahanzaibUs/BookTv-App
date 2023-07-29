import crashlytics from "@react-native-firebase/crashlytics";
import API, { getError } from "@store/api";

export const getSubscriptionPlans = async () => {
  try {
    const { data }: any = await API.get(`/subscriptions?_sort=id:ASC`);
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

export const getPurchasedSubscription = async (userId: number) => {
  try {
    const { data }: any = await API.get(
      `/subscription-purchases?user=${userId}`
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

export const postPurchase = async ({
  productId,
  platform,
  receipt,
  packageName,
  purchaseToken,
  ...rest
}: any) => {
  try {
    crashlytics().log(`Purchase product ${productId}`);
    let response: any = {};
    const upperProductId = productId.toUpperCase();

    if (
      upperProductId.includes("MEMBER") ||
      upperProductId.includes("UPGRADE")
    ) {
      const { data }: any = await API.post(`/subscription-purchases`, {
        productId,
        platform,
        receipt,
        packageName,
        purchaseToken,
      });
      response = data;
    } else {
      const { data }: any = await API.post(`/lesson-purchases`, {
        productId,
        platform,
        receipt,
        purchaseToken,
        ...rest,
      });
      response = data;
    }

    console.log("New purchase", response);
    return {
      success: true,
      data: response,
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
